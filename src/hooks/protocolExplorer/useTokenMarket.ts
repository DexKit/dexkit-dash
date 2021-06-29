import { useTokenPriceUSD } from "hooks/useTokenPriceUSD";
import {  useEffect, useState } from "react";

import { EthereumNetwork, EXCHANGE } from "shared/constants/AppEnums";
import { OrderSide, Token } from "types/app";
import {useQuery} from '@apollo/client';
import { BITQUERY_TOKEN_SINGLE_EXPLORER } from "services/graphql/bitquery/protocol/gql";
import { GET_EXCHANGE_NAME } from "shared/constants/Bitquery";
import { POLL_INTERVAL } from "shared/constants/AppConst";
import { GetTokenSingleExplorer,  GetTokenSingleExplorerVariables } from "services/graphql/bitquery/protocol/__generated__/GetTokenSingleExplorer";
import useInterval from "hooks/useInterval";



type TokenMarket = {
  priceUsd: number;
  volume24Usd: number;
  volume24Base: number;
  trades: number;

}



export const useTokenMarket = (networkName: EthereumNetwork, exchange: EXCHANGE, token?: Token  ) => {
   
   const [data, setData] = useState<TokenMarket>()

    const {priceQuote} = useTokenPriceUSD(token?.address, networkName, OrderSide.Sell, 1, token?.decimals, true);
    
    const [yesterday, setYesterday] = useState<Date>(new Date(new Date().getTime() - 24 * 3600 * 1000));

    useInterval(()=> {
        setYesterday(new Date(new Date().getTime() - 24 * 3600 * 1000)) 
      }, POLL_INTERVAL )


    const {loading, error, data: dataFn} = useQuery<GetTokenSingleExplorer, GetTokenSingleExplorerVariables>(BITQUERY_TOKEN_SINGLE_EXPLORER, {
      variables: {
        network: networkName,
        exchangeName: exchange === EXCHANGE.ALL ? undefined : GET_EXCHANGE_NAME(exchange),
        baseAddress: token?.address ?? ' ',
        from: yesterday
      },
      skip: !token,
      pollInterval: POLL_INTERVAL,
    });
   



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


  
  
    return {priceQuote, data, loading}

}