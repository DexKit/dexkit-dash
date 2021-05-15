import { gql } from "@apollo/client/core";


export const BITQUERY_TOKEN_PAIRS = gql`
  query GetTokenPairs($network: EthereumNetwork!, $exchangeName: String, $baseAddress: String!, $from: ISO8601DateTime, $limit: Int!  ) {
    ethereum(network: $network) {
       dexTrades(
        options: {limit: $limit, desc: ["tradeAmountInUsd"]}
        exchangeName: {is: $exchangeName}
        baseCurrency: {is: $baseAddress}
        date: {since: $from}
      ) {
        trades: count
        baseAmount
        baseAmountInUsd: baseAmount(in: USD)
        baseCurrency {
          name
          symbol
          address
          decimals
        }
        quotePrice
        quoteAmount
        quoteAmountInUsd: quoteAmount(in: USD)
        quoteCurrency {
          name
          symbol
          address
          decimals
        }
        exchange{
            fullName
        }
        protocol
        tradeAmount(in: ETH)
        tradeAmountInUsd: tradeAmount(in: USD)
        maximumPrice: quotePrice(calculate: maximum)
        minimumPrice: quotePrice(calculate: minimum)
        openPrice: minimum(of: block, get: quote_price)
        closePrice: maximum(of: block, get: quote_price)
        smartContract{
          address {
            address
           }
        }
      }
    }
  }
`;


export const BITQUERY_PAIR_TRADES = gql`
  query GetPairTrades($network: EthereumNetwork!, $exchangeName: String, $baseAddress: String!, $quoteAddress: String!, $limit: Int!, $offset: Int!, $from: ISO8601DateTime, $till: ISO8601DateTime) {
    ethereum(network: $network) {
      dexTrades(
        options: {desc: ["block.height", "tradeIndex"], limit: $limit, offset: $offset}
        date: {since: $from, till: $till}
        exchangeName: {is: $exchangeName}
        baseCurrency: {is: $baseAddress }
        quoteCurrency: {is: $quoteAddress}
      ) {
        timeInterval {
          second
        }
        date {
          date
        }
        block {
          timestamp {
            time(format: "%Y-%m-%d %H:%M:%S")
          }
          height
        }
        tradeIndex
        protocol
        exchange {
          fullName
          name
        }
        smartContract {
          address {
            address
            annotation
          }
        }
        transaction {
          hash
        }
        baseAmount
        baseAmountInUsd: baseAmount(in: USD)
        baseCurrency {
          address
          symbol
          name
          decimals
        }
        quoteAmount
        quoteAmountInUsd: quoteAmount(in: USD)
        quoteCurrency {
          address
          symbol
          name
          decimals
        }
        quotePrice
        tradeAmount(in: ETH)
        tradeAmountIsUsd: tradeAmount(in: USD)
        side
      }
    }
  }
`;


export const BITQUERY_TOTAL_TOKEN_TRADES = gql`
  query GetTotalTokenTrades($network: EthereumNetwork!, 
  $exchangeName: String, 
  $baseAddress: String, 
  $quoteAddress: String, $from: ISO8601DateTime, $till: ISO8601DateTime, $tradeAmount: Float) {
    ethereum(network: $network) {
      dexTrades(
        date: {since: $from, till: $till}
        exchangeName: {is: $exchangeName}
        baseCurrency: {is: $baseAddress}
        quoteCurrency: {is: $quoteAddress}
        tradeAmountUsd: {gt: $tradeAmount}
      ) {
        totalTrades: count 
      }
    }
  }
`;

export const BITQUERY_PAIR_EXPLORER_24 = gql`
  query GetPairExplorer24 ($network: EthereumNetwork!, $exchangeName: String, $baseAddress: String!, $quoteAddress: String! $from: ISO8601DateTime) {
    ethereum(network: $network) {
      data24: dexTrades(
        date: {since: $from}
        exchangeName: {is: $exchangeName}
        baseCurrency: {is: $baseAddress}
        quoteCurrency: {is: $quoteAddress}
      ) {
  
        trades: count
        baseAmount
        baseAmountInUsd: baseAmount(in: USD)
        baseCurrency {
          name
          symbol
          address
          decimals
        }
        quotePrice
        quoteAmount
        quoteAmountInUsd: quoteAmount(in: USD)
        quoteCurrency {
          name
          symbol
          address
          decimals
        }
        tradeAmount(in: ETH)
        tradeAmountInUsd: tradeAmount(in: USD)
        maximum_price: quotePrice(calculate: maximum)
        minimum_price: quotePrice(calculate: minimum)
        open_price: minimum(of: block, get: quote_price)
        close_price: maximum(of: block, get: quote_price)
        tradeAmountInUsd: tradeAmount(in: USD)
      }
    }
  }
`;