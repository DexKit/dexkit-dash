import {useEffect, useMemo, useState} from 'react';
import {useWeb3} from 'hooks/useWeb3';
import {
  GetAllMyBalance,
  GetAllMyBalanceVariables,
} from 'services/graphql/bitquery/balance/__generated__/GetAllMyBalance';
import {BITQUERY_ALL_BALANCE_INFO} from 'services/graphql/bitquery/balance/gql';
import {getTokens} from 'services/rest/coingecko';
import {client} from 'services/graphql';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {MyBalances} from 'types/blockchain';
import {useQuery} from 'react-query';
import { CoinItemCoinGecko } from 'types/coingecko/coin.interface';

export const MapBalancesToNetwork = (
  balances: any,
  network: any,
  coin: string,
): MyBalances[] => {
  if (!balances) {
    return [];
  }
  return balances.map((t: any) => {
    const addr =
      t.currency?.address === '-' ? coin : t?.currency?.address?.toLowerCase();

    return (<MyBalances>{
      currency: {
        ...t.currency,
        address: addr,
      },
      network: network,
      value: t.value,
      // enquanto não vem a solução pela bitquery
    }) as MyBalances;
  });
};

export const MapBalancesToUSDValue = (
  balances: any,
  usdValues: {[address: string]: CoinItemCoinGecko}
): MyBalances[] => {
  if (!balances) {
    return [];
  }
  return balances.map((t: MyBalances) => {
    return (<MyBalances>{
      ...t,
      price24hPercentage:
        usdValues[t.currency?.address || '']?.price_change_percentage_24h || 0,
      valueInUsd:
        (t.value || 0) *
        (usdValues[t.currency?.address || '']?.current_price || 0),

      logoURI: usdValues[t.currency?.address || '']?.image
      // enquanto não vem a solução pela bitquery
    }) as MyBalances;
  });
};

// Get balance from BSC, ETH, Matic at once
export const useAllBalance = (defaultAccount?: string) => {
  const {account: web3Account} = useWeb3();
  const account = defaultAccount || web3Account;

  const myBalancesQuery = useQuery(
    ['GetMyBalancesQuery', account],
    () => {
      if (account) {
        return client
          .query<GetAllMyBalance, GetAllMyBalanceVariables>({
            query: BITQUERY_ALL_BALANCE_INFO,
            variables: {
              address: account,
            },
            errorPolicy: 'none',
          })
          .then((balances) => {
            const allMyBalances = MapBalancesToNetwork(
              balances.data.ethereum?.address[0].balances,
              EthereumNetwork.ethereum,
              'eth',
            )
              .concat(
                MapBalancesToNetwork(
                  balances.data.bsc?.address[0].balances,
                  EthereumNetwork.bsc,
                  'bnb',
                ),
              )
              .concat(
                MapBalancesToNetwork(
                  balances.data.matic?.address[0].balances,
                  EthereumNetwork.matic,
                  'matic',
                ),
              );
            return allMyBalances.filter((b) => b?.value && b?.value > 0) || [];
          });
      }
    },
    {staleTime: 60 * 60},
  );

  const usdValuesQuery = useQuery(
    ['GetCoingeckoUsdValues', myBalancesQuery.data],
    () => {
      const balances = myBalancesQuery.data;
      if (balances) {
        const tokens = balances.map((b) => {
          return {
            network: b.network,
            address: b.currency?.address as string,
          };
        });
        return getTokens(tokens);
      }
    },
    {staleTime: 60 * 60},
  );
  const data = useMemo(() => {
    if (usdValuesQuery.data && myBalancesQuery.data) {
      return (
        MapBalancesToUSDValue(myBalancesQuery.data, usdValuesQuery.data).filter(
          (b) => b?.value && b?.value > 0,
        ) || []
      );
    }
    if (myBalancesQuery.data) {
      return myBalancesQuery.data || [];
    }
    return [];
  }, [usdValuesQuery.data, myBalancesQuery.data]);

  const error = myBalancesQuery.isError && {message: 'Error Fetching Data'};

  return {
    loading: myBalancesQuery.isLoading,
    error,
    data,
    loadingUsd: usdValuesQuery.isLoading,
    errorUSD: usdValuesQuery.error,
  };
};
