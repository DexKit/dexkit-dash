import { EthereumNetwork, EXCHANGE } from "shared/constants/AppEnums";
import { BITQUERY_TOKEN_TRADES } from "./gql";
import {client} from '..'
import { GetTokenTrades, GetTokenTradesVariables } from "./__generated__/GetTokenTrades";



export const getPairContractFromExchange = async (baseAddress: string, quoteAddress: string, networkName: EthereumNetwork, exchange: EXCHANGE) => {

    const {data } = await client.query<GetTokenTrades, GetTokenTradesVariables>({
        query: BITQUERY_TOKEN_TRADES,
        variables: {
          network: networkName,
          exchangeName: exchange,
          baseAddress,
          quoteAddress,
          limit: 1,
          offset: 0
        }
      });
      console.log(exchange);
      console.log(networkName);
     if(data && data.ethereum?.dexTrades && data.ethereum?.dexTrades.length){
         return data.ethereum?.dexTrades[0].smartContract?.address?.address as string
     }else{ 
         return null
     }


}