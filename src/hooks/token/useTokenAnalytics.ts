import { useQuery } from "@apollo/client/react/hooks/useQuery";

import { useEffect, useState } from "react";
import { BITQUERY_TOKEN_ANALYTICS } from "services/graphql/bitquery/token/gql";
import { GetTokenAnalytics, GetTokenAnalyticsVariables } from "services/graphql/bitquery/token/__generated__/GetTokenAnalytics";
import { POLL_INTERVAL } from "shared/constants/AppConst";
import { EthereumNetwork } from "shared/constants/AppEnums";
import { getCurrency } from "utils/bitquery";


interface TokenAnalytics{
    amountBuySpentUSD : number;
    amountSellSpentUSD : number ;
    tradeProfitUSD: number;
    gasValueSpentUSD: number;
    averageBuyPrice: number ;
    averageSellPrice: number ;
    totalTx: number;
}



/**
 * Return all related token analytics
 */
export const useTokenAnalytics = (account: string, token: string, network: EthereumNetwork) => {
    const [data, setData] = useState<TokenAnalytics>();

    const {loading, error, data: dataFn} = useQuery<GetTokenAnalytics, GetTokenAnalyticsVariables>(BITQUERY_TOKEN_ANALYTICS, {
        variables: {
          network,
          baseCurrency: getCurrency(network, token) as string,
          address: account
        },
        pollInterval: POLL_INTERVAL,
      });

      useEffect(() => {
        if (dataFn && dataFn?.ethereum?.dexTrades ) {
            setData(undefined);
            const sellSide = dataFn?.ethereum?.dexTrades.find(t => t.side?.toUpperCase() === 'SELL');
            const buySide = dataFn?.ethereum?.dexTrades.find(t => t.side?.toUpperCase() === 'BUY');
            if(sellSide && buySide){
                setData({
                    amountBuySpentUSD: buySide.amountUSD || 0,
                    amountSellSpentUSD: sellSide.amountUSD || 0,
                    tradeProfitUSD: (sellSide.amountUSD || 0) - (buySide.amountUSD || 0),
                    gasValueSpentUSD: (sellSide.gasValueUSD || 0) + (buySide.gasValueUSD || 0), 
                    averageBuyPrice: (buySide.amountUSD || 0) / (buySide.baseAmount && buySide.baseAmount !== 0 ? buySide.baseAmount : 1),
                    averageSellPrice: (sellSide.amountUSD || 0) / (sellSide.baseAmount && sellSide.baseAmount !== 0 ? sellSide.baseAmount : 1),
                    totalTx:  (sellSide.count || 0) + (buySide.count || 0)
                })
            }
            if(sellSide && !buySide){
                setData({
                    amountBuySpentUSD: 0,
                    amountSellSpentUSD: sellSide.amountUSD || 0,
                    tradeProfitUSD: (sellSide.amountUSD || 0),
                    gasValueSpentUSD: (sellSide.gasValueUSD || 0) , 
                    averageBuyPrice: 0,
                    averageSellPrice: (sellSide.amountUSD || 0) / (sellSide.baseAmount && sellSide.baseAmount !== 0 ? sellSide.baseAmount : 1),
                    totalTx:  (sellSide.count || 0),
                })
            }
            if(!sellSide && buySide){
                setData({
                    amountBuySpentUSD: buySide.amountUSD || 0,
                    amountSellSpentUSD: 0,
                    tradeProfitUSD:   (buySide.amountUSD || 0),
                    gasValueSpentUSD: (buySide.gasValueUSD || 0), 
                    averageBuyPrice: (buySide.amountUSD || 0) / (buySide.baseAmount && buySide.baseAmount !== 0 ? buySide.baseAmount : 1),
                    averageSellPrice: 0,
                    totalTx:   (buySide.count || 0)
                })
            }

            
        }   
      }, [dataFn])
    
      return {data, loading, error}

}