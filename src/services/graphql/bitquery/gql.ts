import { gql } from '@apollo/client';

//https://explorer.bitquery.io/graphql
export const BITQUERY_PAIR_EXPLORER = gql`
  query ($network: EthereumNetwork!, $exchangeName: String!, $address: String!, $limit: Int) {
    ethereum(network: $network) {
      dexTrades(
        options: {limit: $limit, desc: "timeInterval.day"}
        exchangeName: {is: $exchangeName}
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
        baseAmountInUSD: baseAmount(in: USD)
        quoteCurrency {
          symbol
          address
        }
        quoteAmount
        quoteAmountInUSD: quoteAmount(in: USD)
        trades: count
        quotePrice
        maximum_price: quotePrice(calculate: maximum)
        minimum_price: quotePrice(calculate: minimum)
        open_price: minimum(of: block, get: quote_price)
        close_price: maximum(of: block, get: quote_price)
        tradeAmount(in: ETH)
        tradeAmountInUSD: tradeAmount(in: USD)
      }
    }
  }

`;

export const BITQUERY_CONTRACT_ORDERS = gql`
  query ($network: EthereumNetwork!, $exchangeName: String!, $address: String!, $limit: Int!, $offset: Int!, $from: ISO8601DateTime, $till: ISO8601DateTime) {
    ethereum(network: $network) {
      dexTrades(
        options: {desc: ["block.height", "tradeIndex"], limit: $limit, offset: $offset}
        date: {since: $from, till: $till}
        exchangeName: {is: $exchangeName}
        smartContractAddress: { is: $address }
      ) {
        side
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
        buyAmount
        buyAmountInUsd: buyAmount(in: USD)
        buyCurrency {
          address
          symbol
        }
        sellAmount
        sellAmountInUsd: sellAmount(in: USD)
        sellCurrency {
          address
          symbol
        }
        tradeAmount(in: ETH)
        tradeAmountIsUsd: tradeAmount(in: USD)
      }
    }
  }
`;

export const BITQUERY_TOKEN_ORDERS = gql`
  query ($network: EthereumNetwork!, $exchangeName: String!, $address: String!, $limit: Int!, $offset: Int!, $from: ISO8601DateTime, $till: ISO8601DateTime) {
    ethereum(network: $network) {
      dexTrades(
        options: {desc: ["block.height", "tradeIndex"], limit: $limit, offset: $offset}
        date: {since: $from, till: $till}
        exchangeName: {is: $exchangeName}
        buyCurrency: {is: $address}
      ) {
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
        buyAmount
        buyAmountInUsd: buyAmount(in: USD)
        buyCurrency {
          address
          symbol
        }
        sellAmount
        sellAmountInUsd: sellAmount(in: USD)
        sellCurrency {
          address
          symbol
        }
        tradeAmount(in: ETH)
        tradeAmountIsUsd: tradeAmount(in: USD)
      }
    }
  }
`;

export const BITQUERY_MY_ORDERS = gql`
  query ($network: EthereumNetwork!, $exchangeName: String!, $address: String!, $limit: Int!, $offset: Int!, $from: ISO8601DateTime, $till: ISO8601DateTime) {
    ethereum(network: $network) {
      dexTrades(
        options: {desc: ["block.height", "tradeIndex"], limit: $limit, offset: $offset}
        date: {since: $from, till: $till}
        exchangeName: {is: $exchangeName}
        makerOrTaker: { is: $address }
      ) {
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
        buyAmount
        buyAmountInUsd: buyAmount(in: USD)
        buyCurrency {
          address
          symbol
        }
        sellAmount
        sellAmountInUsd: sellAmount(in: USD)
        sellCurrency {
          address
          symbol
        }
        tradeAmount(in: ETH)
        tradeAmountIsUsd: tradeAmount(in: USD)
      }
    }
  }
`;

export const BITQUERY_ORDERS_BY_TOKENS = gql`
  query ($network: EthereumNetwork!, $exchangeName: String!, $limit: Int!, $offset: Int!, $from: ISO8601DateTime, $till: ISO8601DateTime) {
    ethereum(network: $network) {
      dexTrades(
        options: {desc: "currencyAmount", limit: $limit, offset: $offset}
        date: {since: $from, till: $till}
        exchangeName: {is: $exchangeName}
      ) {
        currency: baseCurrency {
          symbol
          address
        }
        count
        currencyAmount: baseAmount(in: USD)
        dates: count(uniq: dates)
        started: minimum(of: date)
      }
    }
  }
`

export const BITQUERY_ORDERS_BY_PAIRS = gql`
  query ($network: EthereumNetwork!, $exchangeName: String!, $limit: Int!, $offset: Int!, $from: ISO8601DateTime, $till: ISO8601DateTime) {
    ethereum(network: $network) {
      dexTrades(
        options: {desc: "count", limit: $limit, offset: $offset}
        date: {since: $from, till: $till}
        exchangeName: {is: $exchangeName}
      ) {
        sellCurrency {
          symbol
          address
        }
        sellAmount
        buyCurrency {
          symbol
          address
        }
        buyAmount
        count
        median_price: price(calculate: median)
        last_price: maximum(of: block, get: price)
        dates: count(uniq: dates)
        started: minimum(of: date)
      }
    }
  }
`

export const BITQUERY_MY_TRANSFERS = gql`
  query ($network: EthereumNetwork!, $address: String!, $limit: Int!, $offset: Int!, $from: ISO8601DateTime, $till: ISO8601DateTime) {
    ethereum(network: $network) {
      sender: transfers(
        options: {desc: "block.height", limit: $limit, offset: $offset}
        date: {since: $from, till: $till}
        amount: {gt: 0}
        sender: {is: $address}
      ) {
        block {
          timestamp {
            time(format: "%Y-%m-%d %H:%M:%S")
          }
          height
        }
        sender {
          address
          annotation
        }
        receiver {
          address
          annotation
        }
        currency {
          address
          symbol
        }
        amount
        transaction {
          hash
        }
        external
      }
      receiver: transfers(
        options: {desc: "block.height", limit: $limit, offset: $offset}
        date: {since: $from, till: $till}
        amount: {gt: 0}
        receiver: {is: $address}
      ) {
        block {
          timestamp {
            time(format: "%Y-%m-%d %H:%M:%S")
          }
          height
        }
        sender {
          address
          annotation
        }
        receiver {
          address
          annotation
        }
        currency {
          address
          symbol
        }
        amount
        transaction {
          hash
        }
        external
      }
    }
  }
`;

export const BITQUERY_MY_TOKEN_BALANCE = gql`
  query ($network: EthereumNetwork!, $address: String!) {
    ethereum(network: $network) {
      address(address: {is: $address}) {
        balances {
          currency {
            name
            symbol
            decimals
            address
            tokenType
          }
          value
        }
      }
    }
  }
`;

export const BITQUERY_MY_TOKEN_BALANCE_AT = gql`
  query ($network: EthereumNetwork!, $address: String!, $till: ISO8601DateTime!) {
    ethereum(network: $network) {
      address(address: {is: $address}) {
        balances(date: {till: $till}) {
          currency {
            name
            symbol
            decimals
            address
            tokenType
          }
          value
        }
      }
    }
  }
`;

export const SEARCH = gql`
  query($network: EthereumNetwork!, $value: String!) {
    search(string: $value, network: $network){
      subject {
        ... on Address {
          address
          annotation
        }
        ... on Currency {
          symbol
          name
          address
          tokenId
          tokenType
          decimals
        }
        ... on SmartContract {
          address
          annotation
          contractType
          protocol
        }
        ... on TransactionHash {
          hash
        }
      }
    }
  }
`;

 
  