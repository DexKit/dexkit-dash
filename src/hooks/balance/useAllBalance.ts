import {useMemo} from 'react';
import {useWeb3} from 'hooks/useWeb3';

import {getTokens} from 'services/rest/coingecko';
import {ChainId, MyBalances, Web3State} from 'types/blockchain';
import {useQuery} from 'react-query';
import {CoinItemCoinGecko} from 'types/coingecko/coin.interface';
import { getAllBitqueryBalances } from 'services/bitquery/balances';
import { getAllBlockchainBalances } from 'services/blockchain/balances';


export const MapBalancesToUSDValue = (
  balances: any,
  usdValues: {[address: string]: CoinItemCoinGecko},
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

      logoURI: usdValues[t.currency?.address || '']?.image,
      // enquanto não vem a solução pela bitquery
    }) as MyBalances;
  });
};

// Get balance from BSC, ETH, Matic at once
export const useAllBalance = (defaultAccount?: string) => {
  const {account: web3Account, chainId, web3State} = useWeb3();
  const account = defaultAccount || web3Account;

  const myBalancesQuery = useQuery(
    ['GetMyBalancesQuery', account, chainId, web3State],
    async () => {
      if (account) {
        // we use this to be able to test applications on Ropsten testnet
        if (chainId === ChainId.Ropsten && web3State === Web3State.Done) {
         return getAllBlockchainBalances(chainId, account);
        }
        // On mainnet we return the normal tokens on BSC, Polygon and ETH
        return getAllBitqueryBalances(account)
      }
    },
    {staleTime: 60 * 60},
  );

  const usdValuesQuery = useQuery(
    ['GetCoingeckoUsdValues', myBalancesQuery.data],
    () => {
      const myBalances = myBalancesQuery.data;
      if (myBalances && myBalances.balances) {
        const tokens = myBalances.balances.map((b) => {
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
    if (usdValuesQuery.data && myBalancesQuery.data?.balances) {
      return (
        MapBalancesToUSDValue(
          myBalancesQuery.data?.balances,
          usdValuesQuery.data,
        ).filter((b) => b?.value && b?.value > 0) || []
      );
    }
    if (myBalancesQuery.data?.balances) {
      return myBalancesQuery.data?.balances || [];
    }
    return [];
  }, [usdValuesQuery.data, myBalancesQuery.data]);

  const error = myBalancesQuery.isError && {message: 'Error Fetching Data'};

  return {
    loading: myBalancesQuery.isLoading,
    error,
    data,
    nftBalances: myBalancesQuery.data?.nftBalances,
    loadingUsd: usdValuesQuery.isLoading,
    errorUSD: usdValuesQuery.error,
  };
};
