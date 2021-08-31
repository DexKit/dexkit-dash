import {useEffect, useState} from 'react';
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

export const MapBalancesToUSDValue = (balances: any, usdValues: any): MyBalances[] => {
  if (!balances) {
    return [];
  }
  return balances.map((t: any) => {
    return (<MyBalances>{
      ...t,
      price24hPercentage:
        usdValues[t.addr || '']?.price_change_percentage_24h || 0,
      valueInUsd:
        (t.value || 0) * (usdValues[t.addr || '']?.current_price || 0),
      // enquanto não vem a solução pela bitquery
    }) as MyBalances;
  });
};

// Get balance from BSC, ETH, Matic at once
export const useAllBalance = (defaultAccount?: string) => {
  const {account: web3Account} = useWeb3();
  const account = defaultAccount || web3Account;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>();
  const [data, setData] = useState<MyBalances[]>([]);

  useEffect(() => {
    if (account) {
      setLoading(true);
      client
        .query<GetAllMyBalance, GetAllMyBalanceVariables>({
          query: BITQUERY_ALL_BALANCE_INFO,
          variables: {
            address: account,
          },
          errorPolicy: 'none'
        })
        .then((balances) => {
          const tokensmeta_eth = balances.data.ethereum?.address[0].balances
            ?.map((t) => t.currency?.address?.toLowerCase() || '')
            ?.filter((e) => e !== '-')
            ?.map((a) => {
              return {network: EthereumNetwork.ethereum, address: a};
            });

          const tokensmeta_bnb = balances.data.bsc?.address[0].balances
            ?.map((t) => t.currency?.address?.toLowerCase() || '')
            ?.filter((e) => e !== '-')
            ?.map((a) => {
              return {network: EthereumNetwork.bsc, address: a};
            });

          const tokensmeta_matic = balances.data.matic?.address[0].balances
            ?.map((t) => t.currency?.address?.toLowerCase() || '')
            ?.filter((e) => e !== '-')
            ?.map((a) => {
              return {network: EthereumNetwork.matic, address: a};
            });
          const tokensmeta = (tokensmeta_bnb ?? [])
            .concat(tokensmeta_eth ?? [])
            .concat(tokensmeta_matic ?? []);

         
          const allMyBalances = MapBalancesToNetwork(
            balances.data.ethereum?.address[0].balances,
            EthereumNetwork.ethereum,
            'eth',
          )
            .concat(MapBalancesToNetwork(
              balances.data.bsc?.address[0].balances,
              EthereumNetwork.bsc,
              'bnb',
            ))
            .concat(MapBalancesToNetwork(
              balances.data.matic?.address[0].balances,
              EthereumNetwork.matic,
              'matic',
            ));
          setData(allMyBalances.filter((b) => b?.value && b?.value > 0) || []);
        //  setMetaTokens(tokensmeta);
          if(tokensmeta.length){
            getTokens(tokensmeta).then((coingeckoList) => {
              const tokensWithUSDValue = MapBalancesToUSDValue(allMyBalances, coingeckoList);
              setData(tokensWithUSDValue.filter((b) => b?.value && b?.value > 0));
            }).catch(e=> console.log('Error fetching USD'))
          }
        })
        .catch((e) => {
          setError(e);
          setLoading(false);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      setError(undefined);
      setData([]);
    }
  }, [account]);
  
  return {loading, error, data};
};