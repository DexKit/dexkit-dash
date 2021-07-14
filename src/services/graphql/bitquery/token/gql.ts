import { gql } from '@apollo/client';

export const BITQUERY_TOKEN_ANALYTICS = gql`
query GetTokenAnalytics($network: EthereumNetwork!,  $address: String!, $baseCurrency: String!, $from: ISO8601DateTime, $till: ISO8601DateTime) {
  ethereum(network: $network) {
    dexTrades(
        any: [
           {    
             taker: {is: $address}
           },
           {    
             maker: {is: $address}
           },
         
       ]
       baseCurrency: {is:  $baseCurrency}
       date: {since: $from, till: $till}
     ) {
       amountUSD: baseAmount(in: USD, calculate: sum)
       baseAmount(calculate: sum)
       side
       baseCurrency {
         name
         address
       }
       count
       gasValueUSD: gasValue(calculate: sum, in: USD)
     }
  }
}
`

