import { gql } from '@apollo/client';

//https://explorer.bitquery.io/graphql
export const BITQUERY_PAIR_EXPLORER = gql`
  query($address: String!, $limit: Int, $exchangeName: String!) {
    ethereum(network: ethereum) {
      dexTrades(options: {limit: $limit, desc: "timeInterval.day"},
        exchangeName: {is: $exchangeName}, 
        smartContractAddress: {is: $address}
      ) {
        timeInterval {
          day(count: 1)
        }
        
        baseCurrency {
          symbol
          address
        }
        baseAmount
        baseAmountInUSD: baseAmount(in:USD)
        
        quoteCurrency {
          symbol
          address
        }
        quoteAmount
        quoteAmountInUSD: quoteAmount(in:USD)
        
        trades: count
        quotePrice
        
        maximum_price: quotePrice(calculate: maximum)
        minimum_price: quotePrice(calculate: minimum)
        
        open_price: minimum(of: block get: quote_price)
        close_price: maximum(of: block get: quote_price)
        
        tradeAmount(in:ETH)
        tradeAmountInUSD: tradeAmount(in:USD)
      }
    }
  }`;

  export const BITQUERY_TRADE_HISTORY = gql`query ($address: String!, $limit: Int!, $exchangeName: String!) {
    ethereum(network: ethereum) {
      dexTrades(options: {limit: $limit, desc: "block.height"}, exchangeName: {is: $exchangeName}, smartContractAddress: {is: $address}) {
        transaction {
          hash
        }
        exchange {
          name
        }
        tradeIndex
        date {
          date
        }
        timeInterval {
          second
        }
        block {
          height
        }
        side
        baseAmount
        baseAmountInUsd: baseAmount(in: USD)
        baseCurrency {
          name
          symbol
          address
        }
        quoteAmount
        quoteAmountInUsd: quoteAmount(in: USD)
        quotePrice
        quoteCurrency {
          name
          symbol
          address
        }
        tradeAmount(in: ETH)
        tradeAmountIsUsd: tradeAmount(in: USD)
        transaction {
          gasValue
          gasPrice
          gas
        }
      }
    }
  }  
  `;