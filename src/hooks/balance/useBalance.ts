import {useEffect, useState} from 'react';
import {useWeb3} from 'hooks/useWeb3';
import {
  GetMyBalance,
  GetMyBalanceVariables,
  GetMyBalance_ethereum_address_balances,
} from 'services/graphql/bitquery/balance/__generated__/GetMyBalance';
import {BITQUERY_BALANCE_INFO} from 'services/graphql/bitquery/balance/gql';
import {useNetwork} from 'hooks/useNetwork';
import {getTokens} from 'services/rest/coingecko';
import {client} from 'services/graphql';
import { EthereumNetwork } from 'shared/constants/AppEnums';


export const useBalance = () => {
  const {account} = useWeb3();
  const network = useNetwork();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>();
  const [data, setData] = useState<GetMyBalance_ethereum_address_balances[]>(
    [],
  );

  useEffect(() => {
    if (account) {
      setLoading(true);

      client
        .query<GetMyBalance, GetMyBalanceVariables>({
          query: BITQUERY_BALANCE_INFO,
          variables: {
            network: network,
            address: account,
          },
        })
        .then((balances) => {
          const tokensmeta_eth = balances.data.ethereum?.address[0].balances
          ?.map((t) => t.currency?.address?.toLowerCase() || '')
          ?.filter((e) => e !== '-')
          ?.map(a => {return {network: EthereumNetwork.ethereum, address: a}});

          if (tokensmeta_eth && tokensmeta_eth.length) {
            getTokens(tokensmeta_eth)
              .then((coingeckoList) => {
                const dataFn = balances.data.ethereum?.address[0].balances?.map(
                  (t) => {
                    //   const addr = (t.currency?.address == '-') ? 'eth' : t?.currency?.address?.toLowerCase();

                    const addr = t.currency?.address;

                    return <GetMyBalance_ethereum_address_balances>{
                      currency: {
                        ...t.currency,
                        address: addr,
                      },
                      value: t.value,
                      // enquanto não vem a solução pela bitquery
                      valueInUsd:
                        (t.value || 0) *
                        (coingeckoList[addr || '']?.current_price || 0),
                    };
                  },
                );
                setData(dataFn ?? []);
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
