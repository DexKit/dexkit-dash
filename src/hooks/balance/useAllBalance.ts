import {useEffect, useState} from 'react';
import {useWeb3} from 'hooks/useWeb3';
import {
  GetAllMyBalance,
  GetAllMyBalanceVariables,
} from 'services/graphql/bitquery/balance/__generated__/GetAllMyBalance';
import {BITQUERY_ALL_BALANCE_INFO} from 'services/graphql/bitquery/balance/gql';
import {useNetwork} from 'hooks/useNetwork';
import {getTokens} from 'services/rest/coingecko';
import {client} from 'services/graphql';
import { EthereumNetwork } from 'shared/constants/AppEnums';
import { MyBalances } from 'types/blockchain';


// Get balance from BSC and ETH at once
export const useAllBalance = (defaultAccount?: string) => {
  const {account: web3Account} = useWeb3();
  const account = defaultAccount || web3Account;
  const network = useNetwork();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>();
  const [data, setData] = useState<MyBalances[]>(
    [],
  );

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
            ?.map(a => {return {network: EthereumNetwork.ethereum, address: a}});

          const tokensmeta_bnb = balances.data.bsc?.address[0].balances
            ?.map((t) => t.currency?.address?.toLowerCase() || '')
            ?.filter((e) => e !== '-')
            ?.map(a => {return {network: EthereumNetwork.bsc, address: a}});
          const tokensmeta = (tokensmeta_bnb ?? []).concat(tokensmeta_eth ?? []);
    

          if (tokensmeta.length) {
            getTokens(tokensmeta)
              .then((coingeckoList) => {
                const dataFn = balances.data.ethereum?.address[0].balances?.map(
                  (t) => {
                    const addr = (t.currency?.address === '-') ? 'eth' : t?.currency?.address?.toLowerCase();
                
                    return <MyBalances>{
                      currency: {
                        ...t.currency,
                        address: addr,
                      },
                      network: EthereumNetwork.ethereum,
                      value: t.value,
                      // enquanto não vem a solução pela bitquery
                      valueInUsd:
                        (t.value || 0) *
                        (coingeckoList[addr || '']?.current_price || 0),
                    };
                  },
                );
                const dataFnBNB = balances.data.bsc?.address[0].balances?.map(
                  (t) => {
                    const addr = (t.currency?.address == '-') ? 'bnb' : t?.currency?.address?.toLowerCase();
                
                    return <MyBalances>{
                      currency: {
                        ...t.currency,
                        address: addr,
                      },
                      network: EthereumNetwork.bsc,
                      value: t.value,
                      // enquanto não vem a solução pela bitquery
                      valueInUsd:
                        (t.value || 0) *
                        (coingeckoList[addr || '']?.current_price || 0),
                    };
                  },
                );
              
                const allData = (dataFn ?? []).concat(dataFnBNB ?? []);
                setData(allData.filter(b=> b?.value && b?.value > 0));
              })
              .catch((e) => setError(e))
              .finally(() => setLoading(false));
          } else {
            setData([]);
          }
        })
        .catch((e) => {
          console.info(e);
          setError(e);
          setLoading(false);
        });
    } else {
      setLoading(true);
      setError(undefined);
      setData([]);
    }
  }, [account, network]);

  return {loading, error, data};
};
