/**
 * All related AMM queries
 * 
 */

import { gql } from "@apollo/client/core";


export const BITQUERY_CONTRACT_ORDERS = gql`
 query GetContractOrders($network: EthereumNetwork!, $exchangeName: String, $address: String!, $quoteAddress: String!, $limit: Int!, $offset: Int!, $from: ISO8601DateTime, $till: ISO8601DateTime) {
   ethereum(network: $network) {
     dexTrades(
       options: {desc: ["block.height", "tradeIndex"], limit: $limit, offset: $offset}
       date: {since: $from, till: $till}
       exchangeName: {is: $exchangeName}
       smartContractAddress: {is: $address }
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

export const BITQUERY_TOTAL_CONTRACT_ORDERS = gql`
 query GetTotalContractOrders($network: EthereumNetwork!, $exchangeName: String, $address: String!, $from: ISO8601DateTime, $till: ISO8601DateTime) {
   ethereum(network: $network) {
     dexTrades(
       date: {since: $from, till: $till}
       exchangeName: {is: $exchangeName}
       smartContractAddress: {is: $address }
     ) {
       totalTrades: count
     }
   }
 }
`;


export const BITQUERY_TOKEN_EXPLORER = gql`
  query GetTokenExplorer($network: EthereumNetwork!, $exchangeName: String, $pairAddress: String!, $quoteAddress: String!) {
    ethereum(network: $network) {
      data24: dexTrades(
        options: {limit: 2, desc: "timeInterval.day"}
        exchangeName: {is: $exchangeName}
        smartContractAddress: {is: $pairAddress}
        baseCurrency: {is: $quoteAddress}
      ) {
        timeInterval {
          day(count: 1)
        }
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
        tradeAmount(in: ETH)
        tradeAmountInUsd: tradeAmount(in: USD)
      }
    }
  }
`;


export const BITQUERY_TOTAL_CONTRACT_EVENTS = gql`
query GetTotalContractEvents($network: EthereumNetwork!, $address: String, $events: [String!]) {
  ethereum(network: $network) {
    smartContractEvents(
      smartContractAddress: {is: $address}
      smartContractEvent: {in: $events}
    ) {
      totalEvents: count
    }
  }
}
`;


// DONE
export const BITQUERY_AMM_PAIR_EXPLORER = gql`
  query GetAMMPairExplorer ($network: EthereumNetwork!, $exchangeName: String, $pairAddress: String!, $quoteAddress: String!) {
    ethereum(network: $network) {
      data24: dexTrades(
        options: {limit: 2, desc: "timeInterval.day"}
        exchangeName: {is: $exchangeName}
        smartContractAddress: {is: $pairAddress}
        quoteCurrency: {is: $quoteAddress}
      ) {
        timeInterval {
          day(count: 1)
        }
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
        tradeAmount(in: ETH)
        tradeAmountInUsd: tradeAmount(in: USD)
      }
      pooled: address(address: {is: $pairAddress}) {
        balances {
          currency {
            symbol
          }
          value
        }
      }
    }
  }
`;


export const BITQUERY_PAIR_EXPLORER = gql`
  query GetPairExplorer ($network: EthereumNetwork!, $exchangeName: String, $baseAddress: String!, $quoteAddress: String!) {
    ethereum(network: $network) {
      data24: dexTrades(
        options: {limit: 2, desc: "timeInterval.day"}
        exchangeName: {is: $exchangeName}
        baseCurrency: {is: $baseAddress}
        quoteCurrency: {is: $quoteAddress}
      ) {
        timeInterval {
          day(count: 1)
        }
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
        tradeAmount(in: ETH)
        tradeAmountInUsd: tradeAmount(in: USD)
      }
    }
  }
`;

