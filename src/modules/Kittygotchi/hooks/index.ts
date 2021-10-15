import {BigNumber, ethers} from 'ethers';
import {useNetworkProvider} from 'hooks/provider/useNetworkProvider';
import {useWeb3} from 'hooks/useWeb3';
import {useCallback, useRef, useState} from 'react';
import {useQuery} from 'react-query';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {ChainId, Web3State} from 'types/blockchain';
import {Kittygotchi} from 'types/kittygotchi';
import {
  GET_KITTY_CHAIN_ID,
  KITTYGOTCHI,
  METADATA_KITTY_ENDPOINT,
  PRICE,
} from '../constants';
import {
  getOnchainAttritbutes,
  feed,
  mint,
  signUpdate,
  update,
} from '../services/kittygotchi';

import {
  ApolloClient,
  gql,
  InMemoryCache,
  useQuery as useGraphqlQuery,
} from '@apollo/client';
import {getTokenMetadata} from 'services/nfts';
import {getNormalizedUrl} from 'utils/browser';

const GET_MY_KITTYGOTCHIES = gql`
  query QueryKittygotchies($owner: String!) {
    tokens(where: {owner_contains: $owner}) {
      id
      owner {
        id
      }
      attack
      defense
      run
      uri
    }
  }
`;

const GET_KITTYGOTCHI = gql`
  query QueryKittygotchi($id: String!) {
    token(id: $id) {
      id
      owner {
        id
      }
      attack
      defense
      run
      uri
    }
  }
`;

const THEGRAPH_KITTYGOTCHI_ENDPOINT =
  'https://api.thegraph.com/subgraphs/name/joaocampos89/kittygotchi';

let client = new ApolloClient({
  uri: THEGRAPH_KITTYGOTCHI_ENDPOINT,
  cache: new InMemoryCache(),
});

interface CallbackProps {
  onSubmit?: (hash?: string) => void;
  onConfirmation?: (hash?: string) => void;
  onError?: (error?: any) => void;
}

export function useKittygotchi(id?: string) {
  const {chainId, getProvider, web3State} = useWeb3();

  const provider = useNetworkProvider(undefined, GET_KITTY_CHAIN_ID(chainId));

  const kittyAddress = KITTYGOTCHI[GET_KITTY_CHAIN_ID(chainId)];

  const query = useQuery(
    ['GET_KITTYGOTCHI_META', id, chainId, web3State],
    () => {
      if (id && provider && web3State === Web3State.Done) {
        return fetch(`${METADATA_KITTY_ENDPOINT}${id}`)
          .then((r) => r.json())
          .then(async (r) => {
            const attr = await getOnchainAttritbutes(
              id,
              kittyAddress,
              provider,
            );

            return {
              id,
              ...r,
              ...attr,
            } as Kittygotchi;
          });
      }
    },
  );
  return query;
}

export function useKittygotchiFeed() {
  const {chainId, web3State, getProvider} = useWeb3();

  const kittyAddress = KITTYGOTCHI[GET_KITTY_CHAIN_ID(chainId)];

  const onFeedCallback = useCallback(
    async (id, callbacks?: CallbackProps) => {
      if (
        web3State !== Web3State.Done ||
        !chainId ||
        (chainId !== ChainId.Mumbai && chainId !== ChainId.Matic) ||
        !kittyAddress
      ) {
        return;
      }
      try {
        const tx = await feed(id, kittyAddress, getProvider());
        if (callbacks?.onSubmit) {
          callbacks?.onSubmit(tx.hash);
        }
        await tx.wait();
        if (callbacks?.onConfirmation) {
          callbacks?.onConfirmation(tx.hash);
        }
      } catch (e) {
        if (callbacks?.onError) {
          callbacks?.onError(e);
        }
      }
    },
    [web3State, chainId],
  );

  return {onFeedCallback};
}

export function useKittygotchiMint() {
  const {chainId, web3State, getProvider} = useWeb3();

  const kittyAddress = KITTYGOTCHI[GET_KITTY_CHAIN_ID(chainId)];

  const onMintCallback = useCallback(
    async (callbacks?: CallbackProps) => {
      if (
        web3State !== Web3State.Done ||
        !chainId ||
        (chainId !== ChainId.Mumbai && chainId !== ChainId.Matic) ||
        !kittyAddress
      ) {
        return;
      }
      try {
        const tx = await mint(kittyAddress, getProvider(), PRICE[chainId]);
        if (callbacks?.onSubmit) {
          callbacks?.onSubmit(tx.hash);
        }
        await tx.wait();
        if (callbacks?.onConfirmation) {
          callbacks?.onConfirmation(tx.hash);
        }
      } catch (e) {
        if (callbacks?.onError) {
          callbacks?.onError(e);
        }
      }
    },
    [web3State, chainId, kittyAddress],
  );

  return {onMintCallback};
}

export function useKittygotchiUpdate() {
  const {chainId, web3State, getProvider, account} = useWeb3();

  const kittyAddress = KITTYGOTCHI[GET_KITTY_CHAIN_ID(chainId)];

  const onUpdateKittyCallback = useCallback(
    async (kitty: Kittygotchi, callbacks?: CallbackProps) => {
      if (
        web3State !== Web3State.Done ||
        !chainId ||
        (chainId !== ChainId.Mumbai && chainId !== ChainId.Matic) ||
        !kittyAddress ||
        !account
      ) {
        return;
      }
      try {
        const {sig, messageSigned} = await signUpdate(getProvider(), chainId);
        if (callbacks?.onSubmit) {
          callbacks?.onSubmit();
        }
        await update(sig, messageSigned, kitty.attributes, kitty.id, account);
        if (callbacks?.onConfirmation) {
          callbacks?.onConfirmation();
        }
      } catch (e) {
        if (callbacks?.onError) {
          callbacks?.onError(e);
        }
      }
    },
    [web3State, chainId, account],
  );

  return {onUpdateKittyCallback};
}

export const useKittygotchiList = (address?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Kittygotchi[]>();
  const [error, setError] = useState<any>();

  const get = useCallback(async (address?: string) => {
    return new Promise<Kittygotchi[] | undefined>((resolve, reject) => {
      setIsLoading(true);
      client
        .query<{tokens: any[]}>({
          query: GET_MY_KITTYGOTCHIES,
          variables: {owner: address?.toLowerCase()},
        })
        .then(async (result) => {
          let data: Kittygotchi[] = [];

          for (let k of result.data.tokens) {
            let item: Kittygotchi = {
              id: k.id,
              attack: k.attack ? BigNumber.from(k.attack) : BigNumber.from(0),
              defense: k.defense
                ? BigNumber.from(k.defense)
                : BigNumber.from(0),
              run: k.run ? BigNumber.from(k.run) : BigNumber.from(0),
            };

            let metadata = await getTokenMetadata(k.uri);

            if (metadata.image) {
              item.image = getNormalizedUrl(metadata.image);
            }

            data.push(item);
          }

          setData(data);
          resolve(data);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err);
          setIsLoading(false);
          reject(err);
        });
    });
  }, []);

  return {get, data, error, isLoading};
};

export const useKittygotchiV2 = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Kittygotchi>();
  const [error, setError] = useState<any>();

  const get = useCallback(async (id?: string) => {
    setIsLoading(true);

    client
      .query<{token: any}>({
        query: GET_KITTYGOTCHI,
        variables: {id: id?.toLowerCase()},
      })
      .then(async (result) => {
        let resultData = result.data.token;

        let data: Kittygotchi = {
          id: resultData.id,
          attack: resultData.attack
            ? BigNumber.from(resultData.attack)
            : BigNumber.from(0),
          defense: resultData.defense
            ? BigNumber.from(resultData.defense)
            : BigNumber.from(0),
          run: resultData.run
            ? BigNumber.from(resultData.run)
            : BigNumber.from(0),
        };

        let metadata = await getTokenMetadata(resultData.uri);

        if (metadata.image) {
          data.image = getNormalizedUrl(metadata.image);
        }

        setData(data);

        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);

        setIsLoading(false);
      });
  }, []);

  return {get, data, error, isLoading};
};
