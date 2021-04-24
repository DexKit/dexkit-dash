import { gql } from "@apollo/client/core";


export const BITQUERY_TOKEN_PAIRS = gql`
  query ($network: EthereumNetwork!, $exchangeName: String, $baseAddress: String!, $from: ISO8601DateTime, $limit: Number!  ) {
    ethereum(network: $network) {
       dexTrades(
        options: {limit: $limit, desc: "tradeAmountInUsd"}
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
            fullname
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
  query ($network: EthereumNetwork!, $exchangeName: String, $baseAddress: String!, $quoteAddress: String!, $limit: Int!, $offset: Int!, $from: ISO8601DateTime, $till: ISO8601DateTime) {
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
