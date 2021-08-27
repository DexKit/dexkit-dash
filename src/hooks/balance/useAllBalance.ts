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

// Get balance from BSC, ETH, Matic at once
export const useAllBalance = (defaultAccount?: string) => {
  const {account: web3Account} = useWeb3();
  const account = defaultAccount || web3Account;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>();
  const [data, setData] = useState<MyBalances[]>([]);
  const [_myBalances, setMyBalances] = useState<any[]>([]);
  const [_metaTokens, setMetaTokens] = useState<{network: EthereumNetwork, address: string}[]>([]);

  useEffect(() => {
    if (account) {
      setLoading(true);
      client
        .query<GetAllMyBalance, GetAllMyBalanceVariables>({
          query: BITQUERY_ALL_BALANCE_INFO,
          variables: {
            address: account,
          },
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
          const tokensmeta = (tokensmeta_bnb ?? []).concat(
            tokensmeta_eth ?? [],
          ).concat(tokensmeta_matic ?? []);

          setMetaTokens(tokensmeta)
          const allMyBalances =  (balances.data.ethereum?.address[0].balances ?? [])
                                  .concat(balances.data.bsc?.address[0].balances ?? [])
                                  .concat(balances.data.matic?.address[0].balances ?? [])
          setMyBalances(allMyBalances)

          if (
            tokensmeta.length ||
            balances.data.ethereum?.address[0].balances?.length ||
            balances.data.bsc?.address[0].balances?.length ||
            balances.data.matic?.address[0].balances?.length
          ) {

            getTokens(tokensmeta)
              .then((coingeckoList) => {
                const dataFn = balances.data.ethereum?.address[0].balances?.map(
                  (t) => {
                    const addr =
                      t.currency?.address === '-'
                        ? 'eth'
                        : t?.currency?.address?.toLowerCase();

                    return <MyBalances>{
                      currency: {
                        ...t.currency,
                        address: addr,
                      },
                      network: EthereumNetwork.ethereum,
                      value: t.value,
                      // enquanto não vem a solução pela bitquery
                      price24hPercentage:
                        coingeckoList[addr || '']?.price_change_percentage_24h ||
                        0,
                      valueInUsd:
                        (t.value || 0) *
                        (coingeckoList[addr || '']?.current_price || 0),
                    } as MyBalances;
                  },
                );

                const dataFnBNB = balances.data.bsc?.address[0].balances?.map(
                  (t) => {
                    const addr =
                      t.currency?.address == '-'
                        ? 'bnb'
                        : t?.currency?.address?.toLowerCase();

                    return <MyBalances>{
                      currency: {
                        ...t.currency,
                        address: addr,
                      },
                      network: EthereumNetwork.bsc,
                      value: t.value,
                      price24hPercentage:
                      coingeckoList[addr || '']?.price_change_percentage_24h ||
                      0,
                      // enquanto não vem a solução pela bitquery
                      valueInUsd:
                        (t.value || 0) *
                        (coingeckoList[addr || '']?.current_price || 0),
                    } as MyBalances;
                  },
                );
                const dataFnMatic = balances.data.bsc?.address[0].balances?.map(
                  (t) => {
                    const addr =
                      t.currency?.address == '-'
                        ? 'matic'
                        : t?.currency?.address?.toLowerCase();

                    return <MyBalances>{
                      currency: {
                        ...t.currency,
                        address: addr,
                      },
                      network: EthereumNetwork.matic,
                      value: t.value,
                      price24hPercentage:
                      coingeckoList[addr || '']?.price_change_percentage_24h ||
                      0,
                      // enquanto não vem a solução pela bitquery
                      valueInUsd:
                        (t.value || 0) *
                        (coingeckoList[addr || '']?.current_price || 0),
                    } as MyBalances;
                  },
                );

                const allData = (dataFn ?? []).concat(dataFnBNB ?? []).concat(dataFnMatic ?? []);
                setData(allData.filter((b) => b?.value && b?.value > 0));
              })
              .catch((e) => setError(e))
              .finally(() => setLoading(false));
          } else {
            setData([]);
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
