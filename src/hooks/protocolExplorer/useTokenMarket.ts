import { useTokenPriceUSD } from "hooks/useTokenPriceUSD";
import {  useEffect, useState } from "react";

import { EthereumNetwork, EXCHANGE } from "shared/constants/AppEnums";
import { OrderSide, Token } from "types/app";
import { NetworkStatus, useQuery } from '@apollo/client';
import { BITQUERY_TOKEN_SINGLE_EXPLORER } from "services/graphql/bitquery/protocol/gql";
import { GET_EXCHANGE_NAME } from "shared/constants/Bitquery";
import { POLL_INTERVAL } from "shared/constants/AppConst";
import { GetTokenSingleExplorer,  GetTokenSingleExplorerVariables } from "services/graphql/bitquery/protocol/__generated__/GetTokenSingleExplorer";
import useInterval from "hooks/useInterval";
import { getLast24HoursDate } from "utils/time_utils";



type TokenMarket = {
  priceUsd: number;
  volume24Usd: number;
  volume24Base: number;
  trades: number;
}



export const useTokenMarket = (networkName: EthereumNetwork, exchange: EXCHANGE, token?: Token  ) => {
  const [seconds, setSeconds] = useState(0);
  const [data, setData] = useState<TokenMarket>()

  const {priceQuote} = useTokenPriceUSD(token?.address, networkName, OrderSide.Sell, 1, token?.decimals, seconds === 0);
    
  const [yesterday, setYesterday] = useState<Date>(getLast24HoursDate());
  useInterval(() => {
      setSeconds(seconds +1)
    }, 1000)


  useInterval(() => {
        setYesterday(getLast24HoursDate()) 
    }, POLL_INTERVAL )

    


  const {loading, error, data: dataFn, networkStatus} = useQuery<GetTokenSingleExplorer, GetTokenSingleExplorerVariables>(BITQUERY_TOKEN_SINGLE_EXPLORER, {
      variables: {
        network: networkName,
        exchangeName: exchange === EXCHANGE.ALL ? undefined : GET_EXCHANGE_NAME(exchange),
        baseAddress: token?.address ?? ' ',
        from: yesterday
      },
      skip: !token,
      pollInterval: POLL_INTERVAL,
    });
  useEffect(()=>{
    if(networkStatus === NetworkStatus.ready){
      setSeconds(0)
    }

    
  },[networkStatus])
    
   
  useEffect(() => { 
      if(dataFn && dataFn.ethereum?.dexTrades && dataFn.ethereum.dexTrades.length && priceQuote){
          const tokenMarket = dataFn.ethereum.dexTrades[0]
          setData({
            priceUsd: Number(priceQuote.price),
            volume24Usd: tokenMarket.baseAmountInUsd as number,
            volume24Base:  tokenMarket.baseAmountInUsd  as number,
            trades: tokenMarket.trades  as number
          })
      }
    }, [loading, error, dataFn, priceQuote])


  return {
       priceQuote,
       data,
       loading,
       nextRefresh: (seconds / (POLL_INTERVAL/1000)) * 100,
       seconds,
      
      }

}