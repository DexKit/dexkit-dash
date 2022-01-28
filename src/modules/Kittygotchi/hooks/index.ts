import {BigNumber, ethers, providers} from 'ethers';
import {useNetworkProvider} from 'hooks/provider/useNetworkProvider';
import {useWeb3} from 'hooks/useWeb3';
import {useCallback, useState} from 'react';
import {useQuery} from 'react-query';
import {ChainId, Web3State} from 'types/blockchain';
import {Kittygotchi} from 'types/kittygotchi';
import {Token} from 'types/app';

import {
  getImageFromTrait,
  getKittygotchiMetadataEndpoint,
  GET_KITTYGOTCHI_MINT_RATE,
  isKittygotchiNetworkSupported,
} from 'modules/Kittygotchi/utils/index';

import {
  GET_KITTYGOTCHI_CONTRACT_ADDR,
  KittygotchiTraitType,
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
import {GET_DEXKIT} from 'shared/constants/tokens';
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

const THEGRAPH_KITTYGOTCHI_BSC_ENDPOINT =
  'https://api.thegraph.com/subgraphs/name/joaocampos89/kittygotchibsc';

const clientMumbai = new ApolloClient({
  uri: THEGRAPH_KITTYGOTCHI_MUMBAI_ENDPOINT,
  cache: new InMemoryCache(),
});

const clientMatic = new ApolloClient({
  uri: THEGRAPH_KITTYGOTCHI_MATIC_ENDPOINT,
  cache: new InMemoryCache(),
});

const clientBsc = new ApolloClient({
  uri: THEGRAPH_KITTYGOTCHI_BSC_ENDPOINT,
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
    } else if (chainId === ChainId.Binance) {
      return clientBsc;
    } else if (chainId === ChainId.Matic) {
      return clientMatic;
    }

    return undefined;
  }, []);

  return {getClient};
}

export function useKittygotchi(id?: string) {
  const {chainId, web3State} = useWeb3();

  const provider = useNetworkProvider(undefined, chainId);

  const kittyAddress = GET_KITTYGOTCHI_CONTRACT_ADDR(chainId);

  const query = useQuery(
    ['GET_KITTYGOTCHI_META', id, chainId, web3State, kittyAddress],
    () => {
      if (
        id &&
        provider &&
        web3State === Web3State.Done &&
        chainId &&
        kittyAddress
      ) {
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

  const kittyAddress = GET_KITTYGOTCHI_CONTRACT_ADDR(chainId);

  /* eslint-disable */
  const onFeedCallback = useCallback(
    async (id, callbacks?: CallbackProps) => {
      if (
        web3State !== Web3State.Done ||
        !chainId ||
        !isKittygotchiNetworkSupported(chainId) ||
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

  const kittyAddress = GET_KITTYGOTCHI_CONTRACT_ADDR(chainId);

  const onMintCallback = useCallback(
    async (callbacks?: MintCallbacks) => {
      if (
        web3State !== Web3State.Done ||
        !chainId ||
        !isKittygotchiNetworkSupported(chainId) ||
        !kittyAddress
      ) {
        if (callbacks?.onError) {
          callbacks?.onError(
            new Error('There is no address for Binance Smart Chain'),
          );
        }
        return;
      }

      try {
        const tx = await mint(
          kittyAddress,
          getProvider(),
          GET_KITTYGOTCHI_MINT_RATE(chainId),
        );

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

  const kittyAddress = GET_KITTYGOTCHI_CONTRACT_ADDR(chainId);

  const onUpdateKittyCallback = useCallback(
    async (id: string, params: UpdaterParams, callbacks?: CallbackProps) => {
      if (
        web3State !== Web3State.Done ||
        !chainId ||
        !isKittygotchiNetworkSupported(chainId) ||
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

        if (response.ok && response.status === 200) {
          if (callbacks?.onConfirmation) {
            callbacks?.onConfirmation();
          }
        } else if (response.status === 403) {
          throw new Error('Invalid params');
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
        const client = getClient(chainId);

        if (!client) {
          setError(new Error('client not found'));
          return reject('client not found');
        }

        setIsLoading(true);

        client
          ?.query<{tokens: any[]}>({
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
      const client = getClient(chainId);

      if (!client) {
        return undefined;
      }

      setIsLoading(true);

      return client
        ?.query<{token: any}>({
          query: GET_KITTYGOTCHI,
          variables: {id: id?.toLowerCase()},
        })
        .then(async (result: any) => {
          let resultData = result.data.token;

          if (!result.data.token) {
            throw new Error('Kittygotchi not found');
          }

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

          if (metadata.attributes) {
            data.attributes = metadata.attributes;
          }

          if (metadata.name) {
            data.name = metadata.name;
          }

          if (metadata.description) {
            data.description = metadata.description;
          }

          setData(data);

          setIsLoading(false);

          return data;
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

          const kittyAddress = GET_KITTYGOTCHI_CONTRACT_ADDR(chainId) || '';

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
          setIsLoading(false);
        }
      });
    },
    [chainId, getProvider],
  );

  return {get, data, error, isLoading, clear};
};

export const useKitHolding = (account?: string) => {
  const {chainId, getProvider} = useWeb3();

  const networkProvider = useNetworkProvider(undefined, chainId);

  const query = useQuery(['GET_KITTY_HOLDING', account, chainId], async () => {
    if (account && isKittygotchiNetworkSupported(chainId)) {
      if (chainId) {
        const DexKit = GET_DEXKIT(chainId);

        const tokens = [DexKit];
        let pr = networkProvider;

        if (isKittygotchiNetworkSupported(chainId)) {
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
    }
  });

  return query;
};

interface KittyValues {
  cloth?: string;
  eyes?: string;
  mouth?: string;
  nose?: string;
  ears?: string;
  accessory?: string;
  body?: string;
}

export function useKittygotchiStyleEdit() {
  const [values, setValues] = useState<KittyValues>({});

  const getImageArray = useCallback(() => {
    let arr = [];

    if (values?.body) {
      arr.push(getImageFromTrait(KittygotchiTraitType.BODY, values?.body));
    }

    if (values?.ears) {
      arr.push(getImageFromTrait(KittygotchiTraitType.EARS, values?.ears));
    }

    if (values?.eyes) {
      arr.push(getImageFromTrait(KittygotchiTraitType.EYES, values?.eyes));
    }

    if (values?.nose) {
      arr.push(getImageFromTrait(KittygotchiTraitType.NOSE, values?.nose));
    }

    if (values?.mouth) {
      arr.push(getImageFromTrait(KittygotchiTraitType.MOUTH, values?.mouth));
    }

    if (values?.cloth) {
      arr.push(getImageFromTrait(KittygotchiTraitType.CLOTHES, values?.cloth));
    }

    if (values?.accessory) {
      arr.push(
        getImageFromTrait(KittygotchiTraitType.ACCESSORIES, values?.accessory),
      );
    }

    return arr;
  }, [values]);

  const handleSelectCloth = useCallback(
    (item: KittygotchiTraitItem) => {
      setValues({...values, cloth: item.value});
    },
    [values],
  );

  const handleSelectBody = useCallback(
    (item: KittygotchiTraitItem) => {
      setValues({...values, body: item.value});
    },
    [values],
  );

  const handleSelectEyes = useCallback(
    (item: KittygotchiTraitItem) => {
      setValues({...values, eyes: item.value});
    },
    [values],
  );

  const handleSelectNose = useCallback(
    (item: KittygotchiTraitItem) => {
      setValues({...values, nose: item.value});
    },
    [values],
  );

  const handleSelectEars = useCallback(
    (item: KittygotchiTraitItem) => {
      setValues({...values, ears: item.value});
    },
    [values],
  );

  const handleSelectAccessory = useCallback(
    (item: KittygotchiTraitItem) => {
      setValues({...values, accessory: item.value});
    },
    [values],
  );

  const handleSelectMouth = useCallback(
    (item: KittygotchiTraitItem) => {
      setValues({...values, mouth: item.value});
    },
    [values],
  );

  const isEmpty = useCallback(() => {
    return (
      !values?.cloth &&
      !values?.eyes &&
      !values?.mouth &&
      !values?.nose &&
      !values?.ears &&
      !values?.body &&
      !values?.accessory
    );
  }, [values]);

  const fromTraits = useCallback(
    (traits: {value: string; trait_type: string}[]) => {
      let newValues: KittyValues = {};

      for (let t of traits) {
        let traitType = t.trait_type.toLowerCase();

        if (
          traitType === 'attack' ||
          traitType === 'defense' ||
          traitType === 'run'
        ) {
          continue;
        }

        let value = t.value.toLowerCase().replace(new RegExp(' ', 'g'), '-');

        switch (traitType) {
          case 'eyes':
            newValues.eyes = value;

            break;
          case 'ears':
            newValues.ears = value;

            break;
          case 'clothes':
            newValues.cloth = value;
            break;
          case 'mouth':
            newValues.mouth = value;
            break;
          case 'body':
            newValues.body = value;
            break;
          case 'nose':
            newValues.nose = value;
            break;
          case 'accessories':
            newValues.accessory = value;

            break;
        }
      }

      if (!newValues.body) {
        newValues.body = 'body';
      }

      if (!newValues.ears) {
        newValues.ears = 'pointed';
      }

      if (!newValues.eyes) {
        newValues.eyes = 'star';
      }

      if (!newValues.mouth) {
        newValues.mouth = 'cute';
      }

      if (!newValues.nose) {
        newValues.nose = 'fan';
      }

      if (!newValues.accessory) {
        newValues.accessory = 'piercing';
      }

      setValues(newValues);
    },
    [],
  );

  return {
    fromTraits,
    isEmpty,
    getImageArray,
    handleSelectCloth,
    handleSelectBody,
    handleSelectEyes,
    handleSelectAccessory,
    handleSelectEars,
    handleSelectNose,
    handleSelectMouth,
    cloth: values?.cloth,
    eyes: values?.eyes,
    mouth: values?.mouth,
    nose: values?.nose,
    ears: values?.ears,
    body: values?.body,
    accessory: values?.accessory,
    params: {
      clothes: values?.cloth,
      eyes: values?.eyes,
      mouth: values?.mouth,
      nose: values?.nose,
      ears: values?.ears,
      body: values?.body,
      accessories: values?.accessory,
    },
  };
}

export function useKittygotchiMetadata(chainId: number, tokenId: string) {
  const {data} = useQuery([tokenId, chainId]);
  return {};
}

export const GET_KITTYGOTCHI_RANKING = gql`
  query QueryKittygotchiRanking($offset: Int!, $limit: Int!) {
    tokens(
      first: $limit
      skip: $offset
      orderBy: totalStrength
      orderDirection: desc
    ) {
      id
      owner {
        id
      }
      uri
      attack
      totalStrength
    }
  }
`;

export function useKittygotchiRanking(
  chainId?: number,
  offset: number = 0,
  limit: number = 5,
) {
  const {getClient} = useGraphqlClient();

  const {data, isLoading, error} = useQuery(
    [chainId, offset, limit, getClient],
    async () => {
      if (chainId) {
        const client = getClient(chainId);

        const result = (
          await client?.query<{tokens: any[]}>({
            query: GET_KITTYGOTCHI_RANKING,
            variables: {offset, limit},
          })
        )?.data.tokens;

        return (
          result?.map((r: any) => ({
            tokenId: r.id,
            owner: r.owner.id,
            strength: parseInt(r.totalStrength),
          })) || []
        );
      }

      return [];
    },
  );

  return {results: data || [], isLoading, error};
}
