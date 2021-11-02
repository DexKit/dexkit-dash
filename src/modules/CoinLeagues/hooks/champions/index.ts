import {ethers} from 'ethers';
import {useWeb3} from 'hooks/useWeb3';
import React, {useCallback, useEffect, useState} from 'react';

import axios from 'axios';

import {BigNumber} from '@ethersproject/bignumber';
import {useNetworkProvider} from 'hooks/provider/useNetworkProvider';
import {useQuery} from 'react-query';
import {getTokenBalances} from 'services/multicall';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {DEXKIT, BITTOKEN} from 'shared/constants/tokens';
import {Token} from 'types/app';
import {ChainId, Web3State} from 'types/blockchain';
import {
  getChampionMetadata,
  mintCoinLeaguesChampion,
} from 'modules/CoinLeagues/services/champions';
import {CHAMPIONS} from 'modules/CoinLeagues/constants';
import {
  ChampionMetadata,
  CoinLeaguesChampion,
} from 'modules/CoinLeagues/utils/types';

import {
  ApolloClient,
  gql,
  InMemoryCache,
  useQuery as useGraphqlQuery,
} from '@apollo/client';
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
        championsAddress = '';
      }

      setLoading(true);

      return mintCoinLeaguesChampion(pr, championsAddress, (hash: string) => {
        setTransactionHash(hash);

        createNotification({
          title: 'Create Champion',
          body: `Creating a Coin Leagues Champion`,
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
      })
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
  }, [web3State, chainId]);

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
          timeout: 10000,
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

          setError(err);
        });
    },
    [chainId],
  );

  useEffect(() => {
    if (tokenId) {
      fetch(tokenId);
    }
  }, [tokenId]);

  return {data, loading, error, clear, fetch};
};

export const useChampionTokenHolding = (account?: string) => {
  const {chainId} = useWeb3();

  const networkProvider = useNetworkProvider(EthereumNetwork.matic);

  const query = useQuery(
    ['GET_COIN_LEAGUES_BALANCES', account, chainId],
    async () => {
      if (account && chainId) {
        const DexKit = DEXKIT[ChainId.Matic];
        const Bitt = BITTOKEN[ChainId.Matic];

        const tokens = [DexKit, Bitt];

        const [, tb] = await getTokenBalances(
          (tokens.filter((t) => t !== undefined) as Token[]).map(
            (t) => t.address,
          ),
          account,
          networkProvider,
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

const COIN_LEAGUES_CHAMPION_URL_NUMBAI =
  'https://api.thegraph.com/subgraphs/name/joaocampos89/championsmumbai';

const mumbaiClient = new ApolloClient({
  uri: COIN_LEAGUES_CHAMPION_URL_NUMBAI,
  cache: new InMemoryCache(),
});

const GET_MY_CHAMPIONS = gql`
  query QueryChampions($owner: String!) {
    tokens(
      where: {owner_contains: $owner}
      first: 4
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

export function useMyChampions(chainId?: number) {
  const defaultAccount = useDefaultAccount();

  const [data, setData] = useState<any[]>();
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(() => {
    if (defaultAccount && chainId) {
      setLoading(true);

      mumbaiClient
        .query({
          query: GET_MY_CHAMPIONS,
          variables: {owner: defaultAccount.toLocaleLowerCase()},
        })
        .then(async (result) => {
          let tokens: any[] = result.data.tokens;

          let champions: CoinLeaguesChampion[] = [];

          for (let t of tokens) {
            let metadata: ChampionMetadata = await getChampionMetadata(t.id);

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

          setData(champions);
          setLoading(false);
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
        });
    }
  }, [defaultAccount, chainId]);

  useEffect(() => {
    if (chainId && defaultAccount) {
      fetch();
    }
  }, [chainId, defaultAccount]);

  return {fetch, data, loading, error};
}
