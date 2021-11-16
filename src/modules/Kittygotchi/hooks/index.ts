import {BigNumber, ethers, providers} from 'ethers';
import {useNetworkProvider} from 'hooks/provider/useNetworkProvider';
import {useWeb3} from 'hooks/useWeb3';
import {useCallback, useState} from 'react';
import {useQuery} from 'react-query';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {ChainId, Web3State} from 'types/blockchain';
import {Kittygotchi} from 'types/kittygotchi';
import {Token} from 'types/app';

import {
  getImageFromTrait,
  getKittygotchiMetadataEndpoint,
} from 'modules/Kittygotchi/utils/index';

import {
  GET_KITTY_CHAIN_ID,
  KITTYGOTCHI,
  KittygotchiTraitType,
  PRICE,
} from '../constants';
import {
  getOnchainAttritbutes,
  feed,
  mint,
  signUpdate,
  update,
} from '../services/kittygotchi';

import {ApolloClient, gql, InMemoryCache} from '@apollo/client';
import {getTokenMetadata} from 'services/nfts';
import {getNormalizedUrl} from 'utils/browser';
import kittygotchiAbi from '../constants/ABI/kittygotchi.json';
import {DEXKIT} from 'shared/constants/tokens';
import {getTokenBalances} from 'services/multicall';
import {KittygotchiTraitItem} from '../types';

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
      lastUpdated
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
      lastUpdated
    }
  }
`;

const THEGRAPH_KITTYGOTCHI_MUMBAI_ENDPOINT =
  'https://api.thegraph.com/subgraphs/name/joaocampos89/kittygotchimumbai';

const THEGRAPH_KITTYGOTCHI_MATIC_ENDPOINT =
  'https://api.thegraph.com/subgraphs/name/joaocampos89/kittygotchi';

let clientMumbai = new ApolloClient({
  uri: THEGRAPH_KITTYGOTCHI_MUMBAI_ENDPOINT,
  cache: new InMemoryCache(),
});

let clientMatic = new ApolloClient({
  uri: THEGRAPH_KITTYGOTCHI_MATIC_ENDPOINT,
  cache: new InMemoryCache(),
});

interface CallbackProps {
  onSubmit?: (hash?: string) => void;
  onConfirmation?: (hash?: string) => void;
  onError?: (error?: any) => void;
}

interface MintCallbacks {
  onSubmit?: (hash?: string) => void;
  onConfirmation?: (hash?: string, tokenId?: number) => void;
  onError?: (error?: any) => void;
}

export function useGraphqlClient() {
  const getClient = useCallback((chainId?: ChainId) => {
    if (chainId === ChainId.Mumbai) {
      return clientMumbai;
    }

    return clientMatic;
  }, []);

  return {getClient};
}

export function useKittygotchi(id?: string) {
  const {chainId, web3State} = useWeb3();

  const provider = useNetworkProvider(undefined, GET_KITTY_CHAIN_ID(chainId));

  const kittyAddress = KITTYGOTCHI[GET_KITTY_CHAIN_ID(chainId)];

  const query = useQuery(
    ['GET_KITTYGOTCHI_META', id, chainId, web3State, kittyAddress],
    () => {
      if (id && provider && web3State === Web3State.Done && chainId) {
        return fetch(`${getKittygotchiMetadataEndpoint(chainId)}${id}`)
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

  /* eslint-disable */
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
    async (callbacks?: MintCallbacks) => {
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
        let result = await tx.wait();

        if (callbacks?.onConfirmation) {
          if (result.events) {
            if (result.events?.length > 2) {
              let events = result.events;

              let firstEvent = events[1];

              if (firstEvent.args) {
                let topic = firstEvent.args[2];

                if (topic) {
                  let tokenId = (topic as BigNumber).toNumber();

                  callbacks?.onConfirmation(tx.hash, tokenId);
                }
              } else {
                callbacks?.onConfirmation(tx.hash);
              }
            }
          }
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

interface UpdaterParams {
  cloth?: string;
  eyes?: string;
  mouth?: string;
  nose?: string;
  ears?: string;
  accessories?: string;
  body?: string;
}

export function useKittygotchiUpdate() {
  const {chainId, web3State, getProvider, account} = useWeb3();

  const kittyAddress = KITTYGOTCHI[GET_KITTY_CHAIN_ID(chainId)];

  const onUpdateKittyCallback = useCallback(
    async (id: string, params: UpdaterParams, callbacks?: CallbackProps) => {
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
        const response = await update(
          sig,
          messageSigned,
          params,
          id,
          account,
          chainId,
        );
        console.log(response);
        if (response.ok && response.status === 200) {
          if (callbacks?.onConfirmation) {
            callbacks?.onConfirmation();
          }
        } else {
          throw new Error(response.statusText);
        }
      } catch (e) {
        console.log(e);
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
  const {chainId} = useWeb3();

  const {getClient} = useGraphqlClient();

  const get = useCallback(
    async (address?: string) => {
      return new Promise<Kittygotchi[] | undefined>((resolve, reject) => {
        setIsLoading(true);
        getClient(chainId)
          .query<{tokens: any[]}>({
            query: GET_MY_KITTYGOTCHIES,
            variables: {owner: address?.toLowerCase()},
          })
          .then(async (result: any) => {
            let data: Kittygotchi[] = [];

            for (let k of result.data.tokens) {
              let item: Kittygotchi = {
                id: k.id,
                attack: k.attack ? BigNumber.from(k.attack).toNumber() : 0,
                defense: k.defense ? BigNumber.from(k.defense).toNumber() : 0,
                run: k.run ? BigNumber.from(k.run).toNumber() : 0,
                lastUpdated: parseInt(result.lastUpdated)
                  ? BigNumber.from(result.lastUpdated).toNumber()
                  : 0,
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
          .catch((err: any) => {
            setError(err);
            setIsLoading(false);
            reject(err);
          });
      });
    },
    [chainId],
  );

  return {get, data, error, isLoading};
};

export const useKittygotchiV2 = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Kittygotchi>();
  const [error, setError] = useState<any>();
  const {getClient} = useGraphqlClient();
  const {chainId} = useWeb3();

  const get = useCallback(
    async (id?: string) => {
      setIsLoading(true);

      getClient(chainId)
        .query<{token: any}>({
          query: GET_KITTYGOTCHI,
          variables: {id: id?.toLowerCase()},
        })
        .then(async (result: any) => {
          let resultData = result.data.token;

          let data: Kittygotchi = {
            id: resultData.id,
            attack: resultData.attack
              ? BigNumber.from(resultData.attack).toNumber()
              : 0,
            defense: resultData.defense
              ? BigNumber.from(resultData.defense).toNumber()
              : 0,
            run: resultData.run ? BigNumber.from(resultData.run).toNumber() : 0,
            lastUpdated: parseInt(resultData.lastUpdated)
              ? BigNumber.from(resultData.lastUpdated).toNumber()
              : 0,
          };

          let metadata = await getTokenMetadata(resultData.uri);

          if (metadata.image) {
            data.image = getNormalizedUrl(metadata.image);
          }

          setData(data);

          setIsLoading(false);
        })
        .catch((err: any) => {
          setError(err);

          setIsLoading(false);
        });
    },
    [chainId],
  );

  return {get, data, error, isLoading};
};

export const useKittygotchiOnChain = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Kittygotchi>();
  const [error, setError] = useState<any>();
  const {chainId, getProvider} = useWeb3();

  const clear = useCallback(() => {
    setData(undefined);
    setError(undefined);
  }, []);

  const get = useCallback(
    async (id?: string) => {
      clear();
      return new Promise<Kittygotchi | undefined>(async (resolve, reject) => {
        try {
          setIsLoading(true);

          let provider = new ethers.providers.Web3Provider(getProvider());

          const kittyAddress = KITTYGOTCHI[GET_KITTY_CHAIN_ID(chainId)];

          const contract = new ethers.Contract(
            kittyAddress,
            kittygotchiAbi,
            provider,
          );

          let attack = await contract.getAttackOf(id);
          let defense = await contract.getDefenseOf(id);
          let run = await contract.getRunOf(id);
          let lastUpdated = await contract.getLastUpdateOf(id);
          let uri = await contract.tokenURI(id);

          let data: Kittygotchi = {
            id: id ? id : '',
            attack: attack ? BigNumber.from(attack).toNumber() : 0,
            defense: defense ? BigNumber.from(defense).toNumber() : 0,
            run: run ? BigNumber.from(run).toNumber() : 0,
            lastUpdated: parseInt(lastUpdated)
              ? BigNumber.from(lastUpdated).toNumber()
              : 0,
          };

          let metadata = await getTokenMetadata(uri);

          if (metadata.image) {
            data.image = getNormalizedUrl(metadata.image);
          }

          setData(data);
          resolve(data);

          setIsLoading(false);
        } catch (err) {
          reject(err);
        }
      });
    },
    [chainId, getProvider],
  );

  return {get, data, error, isLoading};
};

export const useKitHolding = (account?: string) => {
  const {chainId, getProvider} = useWeb3();

  const networkProvider = useNetworkProvider(EthereumNetwork.matic);

  const query = useQuery(
    ['GET_COIN_LEAGUES_BALANCES', account, chainId],
    async () => {
      if (
        account &&
        (chainId === ChainId.Matic || chainId === ChainId.Mumbai)
      ) {
        const DexKit = DEXKIT[chainId];

        const tokens = [DexKit];
        let pr = networkProvider;
        if (chainId === ChainId.Mumbai) {
          pr = new providers.Web3Provider(getProvider());
        }

        const [, tb] = await getTokenBalances(
          (tokens.filter((t) => t !== undefined) as Token[]).map(
            (t) => t.address,
          ),
          account,
          pr,
        );

        return (tokens.filter((t) => t !== undefined) as Token[]).map((t) => {
          return {
            token: t,
            balance: tb[t.address],
          };
        });
      }
    },
  );

  return query;
};

export function useKittygotchiStyleEdit() {
  const [cloth, setCloth] = useState<string>();
  const [eyes, setEyes] = useState<string>();
  const [mouth, setMouth] = useState<string>();
  const [nose, setNose] = useState<string>();
  const [ears, setEars] = useState<string>();
  const [accessory, setAccessory] = useState<string>();
  const [body, setBody] = useState<string>();

  const getImageArray = useCallback(() => {
    let arr = [];

    if (body) {
      arr.push(getImageFromTrait(KittygotchiTraitType.BODY, body));
    }

    if (ears) {
      arr.push(getImageFromTrait(KittygotchiTraitType.EARS, ears));
    }

    if (eyes) {
      arr.push(getImageFromTrait(KittygotchiTraitType.EYES, eyes));
    }

    if (nose) {
      arr.push(getImageFromTrait(KittygotchiTraitType.NOSE, nose));
    }

    if (mouth) {
      arr.push(getImageFromTrait(KittygotchiTraitType.MOUTH, mouth));
    }

    if (cloth) {
      arr.push(getImageFromTrait(KittygotchiTraitType.CLOTHES, cloth));
    }

    if (accessory) {
      arr.push(getImageFromTrait(KittygotchiTraitType.ACESSOIRES, accessory));
    }

    return arr;
  }, [cloth, eyes, mouth, nose, ears, accessory, body]);

  const handleSelectCloth = useCallback((item: KittygotchiTraitItem) => {
    setCloth(item.value);
  }, []);

  const handleSelectBody = useCallback((item: KittygotchiTraitItem) => {
    setBody(item.value);
  }, []);

  const handleSelectEyes = useCallback((item: KittygotchiTraitItem) => {
    setEyes(item.value);
  }, []);

  const handleSelectNose = useCallback((item: KittygotchiTraitItem) => {
    setNose(item.value);
  }, []);

  const handleSelectEars = useCallback((item: KittygotchiTraitItem) => {
    setEars(item.value);
  }, []);

  const handleSelectAccessory = useCallback((item: KittygotchiTraitItem) => {
    setAccessory(item.value);
  }, []);

  const handleSelectMouth = useCallback((item: KittygotchiTraitItem) => {
    setMouth(item.value);
  }, []);

  const isEmpty = useCallback(() => {
    return !cloth && !eyes && !mouth && !nose && !ears && !body && !accessory;
  }, [cloth, eyes, mouth, nose, ears, body, accessory]);

  return {
    isEmpty,
    getImageArray,
    handleSelectCloth,
    handleSelectBody,
    handleSelectEyes,
    handleSelectAccessory,
    handleSelectEars,
    handleSelectNose,
    handleSelectMouth,
    cloth,
    eyes,
    mouth,
    nose,
    ears,
    body,
    accessory,
    params: {
      body,
      ears,
      eyes,
      nose,
      mouth,
      accessories: accessory,
      clothes: cloth,
    },
  };
}
