import { useEffect, useState } from "react";
import { useWeb3 } from "hooks/useWeb3";
import { GetMyBalance, GetMyBalanceVariables, GetMyBalance_ethereum_address_balances } from "services/graphql/bitquery/balance/__generated__/GetMyBalance";
import { BITQUERY_BALANCE_INFO } from "services/graphql/bitquery/balance/gql";
import { useNetwork } from "hooks/useNetwork";
import { getTokens } from "services/rest/coingecko";
import { client } from "services/graphql";

export const useBalance = () => {
  const {account} = useWeb3();
  const network = useNetwork();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>();
  const [data, setData] = useState<GetMyBalance_ethereum_address_balances[]>([]);

  useEffect(() => {
    if (account) {
      client.query<GetMyBalance, GetMyBalanceVariables>({
        query: BITQUERY_BALANCE_INFO,
        variables: {
          network: network,
          address: account
        }
      })
      .then(balances => {
        const addresses = balances.data.ethereum?.address[0].balances?.map(t => t.currency?.address?.toLowerCase()||'');

        if (addresses) {
          getTokens(addresses)
            .then(coingeckoList => {
              const dataFn = balances.data.ethereum?.address[0].balances?.map(t => {
                return <GetMyBalance_ethereum_address_balances>{
                  currency: {
                    ...t.currency
                  },
                  value: t.value,
                  valueInUsd: (t.value||0) * (coingeckoList[t?.currency?.address?.toLowerCase()||'']?.current_price||0)
                }
              });
              setData(dataFn ?? []);
            })
            .catch(e => setError(e))
            .finally(() => setLoading(false))
        } else {
          setData([]);
        }
      })
      .catch(e => {
        setError(e);
        setLoading(false);
      });
    } else {
      setLoading(true)
      setError(undefined)
      setData([]);
    }
  }, [account]);
  
  return { loading, error, data };
}
 