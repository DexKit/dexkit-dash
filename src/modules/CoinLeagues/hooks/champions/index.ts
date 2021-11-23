import {useCallback, useEffect, useState} from 'react';
import {ethers} from 'ethers';
import {useWeb3} from 'hooks/useWeb3';

import axios from 'axios';

import {useQuery} from 'react-query';

import {DEXKIT, BITTOKEN} from 'shared/constants/tokens';

import {ChainId, Web3State} from 'types/blockchain';
import {
  getChampionMetadata,
  getChampionsTotalSupply,
  mintCoinLeaguesChampion,
} from 'modules/CoinLeagues/services/champions';
import {CHAMPIONS} from 'modules/CoinLeagues/constants';
import {
  ChampionMetadata,
  CoinLeaguesChampion,
} from 'modules/CoinLeagues/utils/types';

import {ApolloClient, gql, InMemoryCache} from '@apollo/client';
import {useDefaultAccount} from 'hooks/useDefaultAccount';
import {useNotifications} from 'hooks/useNotifications';
import {getTransactionScannerUrl} from 'utils/blockchain';
import {NotificationType, TxNotificationMetadata} from 'types/notifications';

export function useChampionMint() {
  const {getProvider, web3State, chainId} = useWeb3();

  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string>();
  const [tokenId, setTokenId] = useState<string>();

  const {createNotification} = useNotifications();

  const clear = useCallback(() => {
    setError(undefined);
    setTransactionHash(undefined);
    setTokenId(undefined);
  }, []);

  const mint = useCallback(async () => {
    clear();
    if (
      web3State === Web3State.Done &&
      (chainId === ChainId.Mumbai || chainId === ChainId.Matic)
    ) {
      let provider = getProvider();
      let pr = new ethers.providers.Web3Provider(provider);

      let championsAddress: string = '';

      if (chainId === ChainId.Mumbai) {
        championsAddress = CHAMPIONS[ChainId.Mumbai];
      } else if (chainId === ChainId.Matic) {
        championsAddress = CHAMPIONS[ChainId.Matic];
      }

      setLoading(true);

      return mintCoinLeaguesChampion(
        pr,
        championsAddress,
        chainId,
        (hash: string) => {
          setTransactionHash(hash);

          createNotification({
            title: 'Create Champion',
            body: `Creating a Coin League Champion`,
            timestamp: Date.now(),
            url: getTransactionScannerUrl(chainId, hash),
            urlCaption: 'View transaction',
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
  }, [web3State, chainId, getProvider, clear, createNotification]);

  return {mint, loading, error, transactionHash, tokenId, clear};
}

export const useChampionMetadata = (tokenId?: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const [data, setData] = useState<ChampionMetadata>();

  const {chainId} = useWeb3();

  const clear = useCallback(() => {
    setError(undefined);
    setData(undefined);
  }, []);

  const fetch = useCallback(
    (tokenId: string, attempts: number = 3) => {
      clear();
      setLoading(true);

      let url = '';

      if (chainId === ChainId.Mumbai) {
        url = `https://coinleaguechampions-mumbai.dexkit.com/api/${tokenId}`;
      } else if (chainId === ChainId.Matic) {
        // TODO: put production url;
        url = `https://coinleaguechampions-mumbai.dexkit.com/api/${tokenId}`;
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

  return {data, loading, error, clear, fetch};
};

export const useChampionTokenHolding = (account?: string) => {
  const {chainId, getProvider} = useWeb3();

  const query = useQuery(
    ['GET_COIN_LEAGUES_BALANCES_HOLDING', account, chainId, getProvider],
    async () => {
      const ABI = [
        'function balanceOf(address _owner) public view returns (uint256 balance)',
      ];

      if (
        account &&
        chainId &&
        (chainId === ChainId.Matic || chainId === ChainId.Mumbai)
      ) {
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

export function useMyChampions(chainId?: number, limit: number = 100) {
  const defaultAccount = useDefaultAccount();

  const [data, setData] = useState<any[]>();
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
            variables: {owner: defaultAccount.toLocaleLowerCase()},
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
      }
    }
  }, [defaultAccount, chainId, limit]);

  useEffect(() => {
    if (chainId && defaultAccount) {
      fetch();
    }
  }, [chainId, defaultAccount]);

  return {fetch, data, loading, error};
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

  return {totalSupply};
}
