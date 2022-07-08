import { useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from 'hooks/useWeb3';

import axios from 'axios';

import { useQuery } from 'react-query';

import { DEXKIT, BITTOKEN } from 'shared/constants/tokens';

import { ChainId, Web3State } from 'types/blockchain';
import {
  getChampionApiEndpoint,
  getChampionMetadata,
  getChampionsTotalSupply,
  mintCoinLeaguesChampion,
} from 'modules/CoinLeague/services/champions';

import {
  ChampionMetadata,
  CoinLeaguesChampion,
} from 'modules/CoinLeague/utils/types';

import {
  ApolloClient,
  gql,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { useDefaultAccount } from 'hooks/useDefaultAccount';
import { useNotifications } from 'hooks/useNotifications';
import { NotificationType, TxNotificationMetadata } from 'types/notifications';
import { getRarityFromBodyType } from 'modules/CoinLeague/utils/champions';
import { getTransactionScannerUrl } from 'utils/blockchain';
import { useLeaguesChainInfo } from 'modules/CoinLeague/hooks/useLeaguesChainInfo';

import {
  GET_CHAMPIONS_CONTRACT_ADDR,
  IS_CHAMPIONS_SUPPORTED_NETWORK,
} from 'modules/CoinLeague/utils/champions';

import { useIntl } from 'react-intl';

export function useChampionMint() {
  const { getProvider, web3State } = useWeb3();
  const { chainId } = useLeaguesChainInfo();

  const { messages } = useIntl();

  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string>();
  const [tokenId, setTokenId] = useState<string>();

  const { createNotification } = useNotifications();

  const clear = useCallback(() => {
    setError(undefined);
    setTransactionHash(undefined);
    setTokenId(undefined);
  }, []);

  const mint = useCallback(async () => {

    clear();


    const championsAddress = GET_CHAMPIONS_CONTRACT_ADDR(chainId);

    if (
      web3State === Web3State.Done &&
      IS_CHAMPIONS_SUPPORTED_NETWORK(chainId) &&
      championsAddress
    ) {
      const provider = getProvider();
      const pr = new ethers.providers.Web3Provider(provider);

      setLoading(true);

      return mintCoinLeaguesChampion(
        pr,
        championsAddress,
        chainId,
        (hash: string) => {
          setTransactionHash(hash);

          createNotification({
            title: messages['app.coinLeague.createChampion'] as string,
            body: messages[
              'app.coinLeague.creatingCoinLeagueChampion'
            ] as string,
            timestamp: Date.now(),
            url: getTransactionScannerUrl(chainId, hash),
            urlCaption: messages['app.coinLeague.viewTransaction'] as string,
            type: NotificationType.TRANSACTION,
            metadata: {
              chainId: chainId,
              transactionHash: hash,
              status: 'pending',
            } as TxNotificationMetadata,
          });
        },
      )
        .then((id: string) => {
          setLoading(false);

          setTokenId(id);

          return id;
        })
        .catch((err: any) => {
          setError(err);
          setLoading(false);

          return undefined;
        });
    }
  }, [web3State, chainId, getProvider, clear, createNotification, messages]);

  return { mint, loading, error, transactionHash, tokenId, clear };
}

export const useChampionMetadata = (tokenId?: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const [data, setData] = useState<ChampionMetadata>();

  const { chainId } = useWeb3();

  const clear = useCallback(() => {
    setError(undefined);
    setData(undefined);
  }, []);

  const fetch = useCallback(
    (tokenId: string, attempts: number = 3) => {
      clear();
      setLoading(true);

      let url = '';

      if (IS_CHAMPIONS_SUPPORTED_NETWORK(chainId)) {
        url = `${getChampionApiEndpoint(chainId)}/${tokenId}`;
      }

      axios
        .get<ChampionMetadata>(url, {
          timeout: 120000,
          timeoutErrorMessage: 'timeout',
        })
        .then((response) => {
          setData(response.data);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);

          if (err.message === 'timeout') {
            if (attempts > 1) {
              fetch(tokenId, attempts - 1);
              return;
            }
          }

          if (err.response) {
            if (err.response.status === 404) {
              fetch(tokenId);
              return;
            }
          }

          setError(err);
        });
    },
    [chainId, clear],
  );

  useEffect(() => {
    if (tokenId) {
      fetch(tokenId);
    }
  }, [tokenId, fetch]);

  return { data, loading, error, clear, fetch };
};

export const useChampionMetadataQuery = (tokenId?: string) => {
  const { chainId } = useWeb3();
  return useQuery(['GET_CHAMPION_METADATA', tokenId, chainId], () => {
    if (!tokenId || !chainId) {
      return;
    }

    let url = `${getChampionApiEndpoint(chainId)}/${tokenId}`;

    return axios
      .get<ChampionMetadata>(url, {
        timeout: 120000,
        timeoutErrorMessage: 'timeout',
      })
      .then((r) => r.data);
  });
};
// TODO: create query on backend to return all these id's at once
export const useChampionsMetadataQuery = (tokenIds?: string[]) => {
  const { chainId } = useWeb3();
  return useQuery(['GET_CHAMPION_METADATA', tokenIds, chainId], async () => {
    if (!tokenIds || !tokenIds.length || !chainId) {
      return;
    }
    let champions = [];
    for (let index = 0; index < tokenIds.length; index++) {
      let url = '';

      if (chainId === ChainId.Mumbai) {
        url = `https://coinleaguechampions-mumbai.dexkit.com/api/${tokenIds[index]}`;
      } else if (chainId === ChainId.Matic) {
        // TODO: put production url;
        url = `https://coinleaguechampions.dexkit.com/api/${tokenIds[index]}`;
      }

      const item = await axios
        .get<ChampionMetadata>(url, {
          timeout: 120000,
          timeoutErrorMessage: 'timeout',
        })
        .then((r) => r.data)
        .then((d) => {
          return {
            id: tokenIds[index],
            ...d,
          };
        });
      champions.push(item);
    }
    return champions;
  });
};

export const useChampionTokenHolding = (account?: string) => {
  const { chainId, getProvider } = useWeb3();

  const query = useQuery(
    ['GET_COIN_LEAGUES_BALANCES_HOLDING', account, chainId, getProvider],
    async () => {
      const ABI = [
        'function balanceOf(address _owner) public view returns (uint256 balance)',
      ];

      if (account && chainId && IS_CHAMPIONS_SUPPORTED_NETWORK(chainId)) {
        const DexKit = DEXKIT[chainId as ChainId];
        const Bitt = BITTOKEN[chainId as ChainId];

        if (DexKit?.address && Bitt?.address) {
          const kitContract = new ethers.Contract(
            DexKit?.address,
            ABI,
            new ethers.providers.Web3Provider(getProvider()).getSigner(),
          );

          const bittContract = new ethers.Contract(
            Bitt?.address,
            ABI,
            new ethers.providers.Web3Provider(getProvider()).getSigner(),
          );

          return {
            kit: parseInt(
              ethers.utils.formatUnits(
                await kitContract.balanceOf(account),
                18,
              ),
            ),
            bitt: parseInt(
              ethers.utils.formatUnits(
                await bittContract.balanceOf(account),
                18,
              ),
            ),
          };
        }

        return {
          kit: 0,
          bitt: 0,
        };
      }
    },
  );

  return query;
};

const COIN_LEAGUES_CHAMPION_URL_NUMBAI =
  'https://api.thegraph.com/subgraphs/name/joaocampos89/championsmumbai';

const COIN_LEAGUES_CHAMPION_URL_MATIC =
  'https://api.thegraph.com/subgraphs/name/joaocampos89/champions';

const mumbaiClient = new ApolloClient({
  uri: COIN_LEAGUES_CHAMPION_URL_NUMBAI,
  cache: new InMemoryCache(),
});

const maticClient = new ApolloClient({
  uri: COIN_LEAGUES_CHAMPION_URL_MATIC,
  cache: new InMemoryCache(),
});

const GET_MY_CHAMPIONS = gql`
  query QueryChampions($owner: String!) {
    tokens(
      where: {owner_contains: $owner}
      first: 100
      orderBy: id
      orderDirection: desc
    ) {
      id
      attack
      defense
      run
      uri
    }
  }
`;

export function useMyChampions(
  params: { chainId?: number; limit?: number; account?: string } = { limit: 100 },
) {
  const { chainId, limit, account } = params;

  const userDefaulAccount = useDefaultAccount();
  const defaultAccount = account ? account : userDefaulAccount;

  const [data, setData] = useState<CoinLeaguesChampion[]>();
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(() => {
    if (defaultAccount && chainId) {
      setLoading(true);
      if (chainId === ChainId.Matic || chainId === ChainId.Mumbai) {
        let client = maticClient;

        if (chainId === ChainId.Mumbai) {
          client = mumbaiClient;
        }
        client
          .query({
            query: GET_MY_CHAMPIONS,
            variables: { owner: defaultAccount.toLocaleLowerCase() },
          })

          .then(async (result) => {
            let tokens: any[] = result.data.tokens;

            let champions: CoinLeaguesChampion[] = [];

            for (let t of tokens) {
              let metadata: ChampionMetadata = await getChampionMetadata(
                t.id,
                chainId,
              );

              let champ: CoinLeaguesChampion = {
                id: t.id,
                name: metadata.name,
                description: metadata.description,
                image: metadata.image,
                attack: parseInt(t.attack),
                defense: parseInt(t.defense),
                run: parseInt(t.run),
                rarity: getRarityFromBodyType(
                  metadata.attributes.find((att) => att.trait_type === 'body')
                    ?.value,
                ),
              };
              champions.push(champ);
            }

            setData(champions.slice(0, limit));
            setLoading(false);
          })
          .catch((err) => {
            setError(err);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    }
  }, [defaultAccount, chainId, limit]);

  useEffect(() => {
    if (chainId && defaultAccount) {
      fetch();
    }
  }, [chainId, defaultAccount, fetch]);

  return { fetch, data, loading, error };
}

export function useChampionsTotalSupply(chainId?: number) {
  const [totalSupply, setTotalSupply] = useState(0);

  useEffect(() => {
    let interval = setInterval(() => {
      getChampionsTotalSupply(chainId).then((data) => {
        setTotalSupply(data.totalSupply + 1);
      });
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [chainId]);

  return { totalSupply };
}

const GET_CHAMPION_BALANCE_QUERY = gql`
  query getChampionBalance($account: ID!) {
    owner(id: $account) {
      balance
    }
  }
`;

const GET_CHAMPION_BALANCE = 'GET_CHAMPION_BALANCE';

export function useChampionBalance(params: { account: string; chainId: number }) {
  const { account, chainId } = params;

  return useQuery([GET_CHAMPION_BALANCE, chainId, account], async () => {
    // TODO: refactor this code later

    let client: ApolloClient<NormalizedCacheObject>;

    if (chainId === ChainId.Mumbai) {
      client = mumbaiClient;
    } else {
      client = maticClient;
    }

    const result = await client.query<{ owner: { balance: string } }>({
      query: GET_CHAMPION_BALANCE_QUERY,
      variables: { account: account?.toLocaleLowerCase() },
    });

    if (result.data.owner !== null) {
      return parseInt(result.data.owner?.balance);
    }

    return 0;
  });
}
