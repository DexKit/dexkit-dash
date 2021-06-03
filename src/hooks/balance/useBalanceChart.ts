import { useEffect, useState } from "react";
import { useWeb3 } from "hooks/useWeb3";

import { BITQUERY_BALANCE_BLOCK, BITQUERY_BALANCE_HISTORY } from "services/graphql/bitquery/balance/gql";
import { useNetwork } from "hooks/useNetwork";
import { client } from "services/graphql";
import { GetBalanceBlock, GetBalanceBlockVariables } from "services/graphql/bitquery/balance/__generated__/GetBalanceBlock";
import { GetMyBalanceHistory, GetMyBalanceHistoryVariables } from "services/graphql/bitquery/balance/__generated__/GetMyBalanceHistory";

export const useBalanceChart = () => {
  const {account} = useWeb3();
  const network = useNetwork();

  const [block, setBlock] = useState<number>();

  const [selectDay, setSelectDay] = useState(7);
  const [selectToken, setSelectToken] = useState<string>('ETH');

  const [allData, setAllData] = useState<{ [idx: string]: {date: Date, value: number}[] }>({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>();
  const [data, setData] = useState<{date: Date, value: number}[]>([]);

  const handleSelectDay = (day: number) => {
    setSelectDay(day);
  }

  const handleSelectToken = (token: string) => {
    if (allData) {
      setData(allData[token])
    }

    setSelectToken(token);
  }

  // useEffect(() => {
  //   if (allData[selectToken]) {
  //     setData(allData[selectToken])
  //   }
  // }, [selectToken]);

  useEffect(() => {
    console.log('get days ago', selectDay)
    const fromDay = new Date();
    fromDay.setDate(fromDay.getDate() - selectDay);
    console.log(fromDay);
    
    client.query<GetBalanceBlock, GetBalanceBlockVariables>({
      query: BITQUERY_BALANCE_BLOCK,
      variables: {
        date: fromDay.toISOString() 
      }
    })
    .then(e => {
      if (e.data.ethereum?.blocks) {
        setBlock(e.data.ethereum?.blocks[0].height)
      }
    });
  }, [selectDay]);

  useEffect(() => {
    if (block != null && account != null && network != null && selectToken != null) {
      client.query<GetMyBalanceHistory, GetMyBalanceHistoryVariables>({
        query: BITQUERY_BALANCE_HISTORY,
        variables: {
          network: network,
          address: account,
          block: block,
        }
      })
      .then(balances => {
        const d = balances.data.ethereum?.address[0].balances?.reduce<{ [idx: string]: {date: Date, value: number}[] }>((acc, current): any => {
          const idx = current.currency?.symbol.toUpperCase();
          const v = [];
          if (idx) {
            if (current.history) {
              for (let i=0; i < current.history.length - 1; i++) {
                const cDate = new Date(current.history[i].timestamp)
                const cValue = current.history[i].value || 0;

                const nDate = new Date(current.history[i+1].timestamp)

                if (v.length == 0) {
                  v.push({date: cDate, value: cValue});
                }

                if (cDate.getFullYear() == nDate.getFullYear() && cDate.getMonth() == nDate.getMonth() && cDate.getDate() == nDate.getDate()) {
                  v[v.length-1] = {date: cDate, value: cValue};
                } else {
                  v.push({date: cDate, value: cValue});
                }
              }
            }
            acc[idx] = v;
            return acc;
          }
        }, {});

        const all = d ?? {};

        setAllData(all);
        setData(all[selectToken] || [])
      })
      .catch(e => {
        setError(e);
      })
      .finally(() => setLoading(false));
    } else {
      setLoading(true)
      setError(undefined)
      setAllData({});
    }
  }, [block, account, network, selectToken]);
  
  return { loading, error, data, handleSelectDay, handleSelectToken };
}
 