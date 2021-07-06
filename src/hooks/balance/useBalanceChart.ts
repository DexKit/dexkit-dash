import { useEffect, useState } from "react";
import { useWeb3 } from "hooks/useWeb3";

import { BITQUERY_BALANCE_BLOCK, BITQUERY_SINGLE_BALANCE_HISTORY } from "services/graphql/bitquery/balance/gql";
import { useNetwork } from "hooks/useNetwork";
import { client } from "services/graphql";
import { GetBalanceBlock, GetBalanceBlockVariables } from "services/graphql/bitquery/balance/__generated__/GetBalanceBlock";
import { GetMySingleBalanceHistory, GetMySingleBalanceHistoryVariables } from "services/graphql/bitquery/balance/__generated__/GetMySingleBalanceHistory";
import { ChartTick } from "types/app";
import { MyBalances } from 'types/blockchain';
import { isNativeCoinFromNetworkName } from "utils";
import { EthereumNetwork } from "shared/constants/AppEnums";
import { useDefaultAccount } from "hooks/useDefaultAccount";


export const useBalanceChart = (balances: MyBalances[]) => {
  const account = useDefaultAccount();
  const [network, setNetwork] = useState<EthereumNetwork>(EthereumNetwork.ethereum);
  const [block, setBlock] = useState<number>();

  const [selectDay, setSelectDay] = useState(7);
  const [selectToken, setSelectToken] = useState<string | undefined>();
  useEffect(()=> {
    if(!selectToken && balances.length > 0){
      setNetwork(balances[0].network);
      setSelectToken(balances[0].currency?.address ?? balances[0].currency?.symbol);
    }


  }, [balances])

  const [allData, setAllData] = useState<{ [idx: string]: ChartTick[] }>({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>();
  const [data, setData] = useState<ChartTick[]>([]);


  const handleSelectDay = (day: number) => {
    setSelectDay(day);
  }

  const handleSelectToken = (token: string, net: EthereumNetwork) => {
    if (allData && allData[token] && allData[token].length) {
      const dataFn: ChartTick[] = allData[token].map((e: any) => {
        return {
          date: e.date.toLocaleDateString(),
          value: e.value
        }
      }) || [];

      setData(dataFn.reverse());
    }
    setNetwork(net);
    setSelectToken(token);
    
 
  }

  useEffect(() => {
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
        setBlock(e.data.ethereum?.blocks[0].height)
      }
    });
  }, [selectDay]);

  useEffect(() => {
    if (block && account  && network  && selectToken  && balances.length > 0) {

      client.query< GetMySingleBalanceHistory, GetMySingleBalanceHistoryVariables>({
        query: BITQUERY_SINGLE_BALANCE_HISTORY,
        variables: {
          network: network,
          address: account,
          block: block,
          currency: selectToken
        }
      })
      .then(b => {
        const data = b.data.ethereum?.address[0].balances?.reduce<{ [idx: string]: ChartTick[] }>((acc, current): any => {
          const idx = isNativeCoinFromNetworkName(current.currency?.symbol.toUpperCase() ?? '', network) ?  current.currency?.symbol.toUpperCase() : current.currency?.address ;
          const v: ChartTick[] = [];
   
          if (idx) {
            const today = new Date();
            const value = balances.find(e => idx === (isNativeCoinFromNetworkName(e.currency?.symbol.toUpperCase() ?? '', network) ?  e.currency?.symbol.toUpperCase() : e.currency?.address)   )?.value || 0;

            v.push({date: today, value: value});
            
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


        const all = data ?? {};


        if(all[selectToken] && all[selectToken].length){
          const dataFn: ChartTick[] = all[selectToken].map((e: any) => {
            return {
              date: e.date.toLocaleDateString(),
              value: e.value
            }
          }) || [];

          setData(dataFn.reverse());
        }
        
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
  
  return { loading, error, data, handleSelectDay, handleSelectToken, selectToken };
}
 