import { useEffect, useState } from "react";
import { useWeb3 } from "hooks/useWeb3";

import { BITQUERY_BALANCE_BLOCK, BITQUERY_BALANCE_HISTORY } from "services/graphql/bitquery/balance/gql";
import { useNetwork } from "hooks/useNetwork";
import { client } from "services/graphql";
import { GetBalanceBlock, GetBalanceBlockVariables } from "services/graphql/bitquery/balance/__generated__/GetBalanceBlock";
import { GetMyBalanceHistory, GetMyBalanceHistoryVariables } from "services/graphql/bitquery/balance/__generated__/GetMyBalanceHistory";
import {GetMyBalance_ethereum_address_balances} from 'services/graphql/bitquery/balance/__generated__/GetMyBalance';
import { ChartTick } from "types/app";

export const useBalanceChart = (balances: GetMyBalance_ethereum_address_balances[]) => {
  const {account} = useWeb3();
  const network = useNetwork();

  const [block, setBlock] = useState<number>();

  const [selectDay, setSelectDay] = useState(7);
  const [selectToken, setSelectToken] = useState<string>('ETH');

  const [allData, setAllData] = useState<{ [idx: string]: ChartTick[] }>({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>();
  const [data, setData] = useState<ChartTick[]>([]);


  const handleSelectDay = (day: number) => {
    setSelectDay(day);
  }

  const handleSelectToken = (token: string) => {
    if (allData && allData[token]) {
      const dataFn: ChartTick[] = allData[selectToken].map((e: any) => {
        return {
          date: e.date.toLocaleDateString(),
          value: e.value
        }
      }) || [];

      setData(dataFn.reverse());
    }

    setSelectToken(token);
  }

  useEffect(() => {
    console.log(`get ${selectDay} days ago`)
    const fromDay = new Date();
    fromDay.setDate(fromDay.getDate() - selectDay);
    
    client.query<GetBalanceBlock, GetBalanceBlockVariables>({
      query: BITQUERY_BALANCE_BLOCK,
      variables: {
        date: fromDay.toISOString() 
      }
    })
    .then(e => {
      if (e.data.ethereum?.blocks) {
        console.log(`find block ${e.data.ethereum?.blocks[0]?.height} for ${fromDay}`);
        setBlock(e.data.ethereum?.blocks[0].height)
      }
    });
  }, [selectDay]);

  useEffect(() => {
    if (block != null && account != null && network != null && selectToken != null && balances.length > 0) {

      client.query<GetMyBalanceHistory, GetMyBalanceHistoryVariables>({
        query: BITQUERY_BALANCE_HISTORY,
        variables: {
          network: network,
          address: account,
          block: block,
        }
      })
      .then(b => {
        const data = b.data.ethereum?.address[0].balances?.reduce<{ [idx: string]: ChartTick[] }>((acc, current): any => {
          const idx = current.currency?.symbol.toUpperCase();
          const v: ChartTick[] = [];
          
          if (idx) {
            const today = new Date();
            const value = balances.find(e => idx == e.currency?.symbol.toUpperCase())?.value || 0;

            v.push({date: today, value: value});
            
            console.log('history'+idx, current.history);

            if (current.history) {
              for (let i=0; i < current.history.length; i++) {
                const vData = v[v.length-1];

                const nDate = new Date(current.history[i].timestamp)
                const nValue = current.history[i].value || 0;

                if (
                  (vData.date.getFullYear() == nDate.getFullYear()) && 
                  (vData.date.getMonth() == nDate.getMonth()) && 
                  (vData.date.getDate() == nDate.getDate())
                ) {
                  vData.date = nDate;
                  vData.value = nValue;
                } else {
                  v.push({date: nDate, value: nValue});
                }
              }
            }


            const fromDay = new Date();
            fromDay.setDate(fromDay.getDate() - selectDay);
            const lastData = v[v.length-1];

            if (lastData.date > fromDay) {
              v.push({date: fromDay, value: lastData.value})
            }

            acc[idx] = v;
            return acc;
          }
        }, {});

        console.log(data);

        const all = data ?? {};

        setAllData(all);

        const dataFn: ChartTick[] = all[selectToken].map((e: any) => {
          return {
            date: e.date.toLocaleDateString(),
            value: e.value
          }
        }) || [];

        setData(dataFn.reverse());
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
  }, [block, account, network, selectToken, balances]);
  
  return { loading, error, data, handleSelectDay, handleSelectToken };
}
 