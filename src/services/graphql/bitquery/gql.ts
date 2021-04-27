import { gql } from '@apollo/client';

//https://explorer.bitquery.io/graphql

// DONE
export const BITQUERY_PAIR_EXPLORER = gql`
  query ($network: EthereumNetwork!, $exchangeName: String, $pairAddress: String!, $quoteAddress: String!) {
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

export const BITQUERY_CONTRACT_ORDERS = gql`
  query ($network: EthereumNetwork!, $exchangeName: String, $address: String!, $quoteAddress: String!, $limit: Int!, $offset: Int!, $from: ISO8601DateTime, $till: ISO8601DateTime) {
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

export const BITQUERY_TOKEN_ORDERS = gql`
  query ($network: EthereumNetwork!, $exchangeName: String, $address: String!, $limit: Int!, $offset: Int!, $from: ISO8601DateTime, $till: ISO8601DateTime) {
    ethereum(network: $network) {
      dexTrades(
        options: {desc: ["block.height", "tradeIndex"], limit: $limit, offset: $offset}
        date: {since: $from, till: $till}
        exchangeName: {is: $exchangeName}
        baseCurrency: {is: $address}
      ) {
        tradeIndex
        block {
          timestamp {
            time(format: "%Y-%m-%d %H:%M:%S")
          }
          height
        }
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
        baseAmount
        baseAmountInUsd: baseAmount(in: USD)
        baseCurrency {
          address
          decimals
          name
          symbol
        }
        quoteAmount
        quoteAmountInUsd: quoteAmount(in: USD)
        quoteCurrency {
          address
          decimals
          name
          symbol
        }
        tradeAmount(in: ETH)
        tradeAmountIsUsd: tradeAmount(in: USD)
      }
    }
  }
`;

export const BITQUERY_MY_ORDERS = gql`
  query ($network: EthereumNetwork!, $exchangeName: String, $address: String!, $limit: Int!, $offset: Int!, $from: ISO8601DateTime, $till: ISO8601DateTime) {
    ethereum(network: $network) {
      maker: dexTrades(
        options: {desc: ["block.height", "tradeIndex"], limit: $limit, offset: $offset}
        date: {since: $from, till: $till}
        exchangeName: {is: $exchangeName}
        maker: {is: $address}
      ) {
        block {
          timestamp {
            time(format: "%Y-%m-%d %H:%M:%S")
          }
          height
        }
        tradeIndex
        protocol
        transaction {
          hash
        }
        exchange {
          fullName
        }
        smartContract {
          address {
            address
            annotation
          }
        }
        side
        baseAmount
        baseAmountInUsd: buyAmount(in: USD)
        baseCurrency {
          name
          address
          symbol
          decimals
        }
        quotePrice
        quoteAmount
        quoteAmountInUsd: sellAmount(in: USD)
        quoteCurrency {
          name
          address
          symbol
          decimals
        }
        tradeAmount(in: ETH)
        tradeAmountIsUsd: tradeAmount(in: USD)
      }
      taker: dexTrades(
        options: {desc: ["block.height", "tradeIndex"], limit: $limit, offset: $offset}
        date: {since: $from, till: $till}
        exchangeName: {is: $exchangeName}
        taker: {is: $address}
      ) {
        block {
          timestamp {
            time(format: "%Y-%m-%d %H:%M:%S")
          }
          height
        }
        date {
          date
        }
        tradeIndex
        protocol
        transaction {
          hash
        }
        exchange {
          fullName
        }
        smartContract {
          address {
            address
            annotation
          }
        }
        side
        baseAmount
        baseAmountInUsd: buyAmount(in: USD)
        baseCurrency {
          name
          address
          symbol
          decimals
        }
        quotePrice
        quoteAmount
        quoteAmountInUsd: sellAmount(in: USD)
        quoteCurrency {
          name
          address
          symbol
          decimals
        }
        tradeAmount(in: ETH)
        tradeAmountIsUsd: tradeAmount(in: USD)
      }
    }
  }
`;

export const BITQUERY_ORDERS_BY_TOKENS = gql`
  query ($network: EthereumNetwork!, $exchangeName: String, $limit: Int!, $offset: Int!, $from: ISO8601DateTime, $till: ISO8601DateTime) {
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
  query ($network: EthereumNetwork!, $exchangeName: String, $limit: Int!, $offset: Int!, $from: ISO8601DateTime, $till: ISO8601DateTime) {
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

export const BITQUERY_ORDERS_BY_HASH = gql`
  query ($network: EthereumNetwork!, $address: String!) {
    ethereum(network: $network) {
      dexTrades(
        txHash: {is: $address}
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
        }
        quoteAmount
        quoteAmountInUsd: quoteAmount(in: USD)
        quoteCurrency {
          address
          symbol
        }
        quotePrice
        tradeAmount(in: ETH)
        tradeAmountIsUsd: tradeAmount(in: USD)
        side
      }
    }
  }
`;

// DONE
export const BITQUERY_MY_TRANSFERS = gql`
  query ($network: EthereumNetwork!, $address: String, $limit: Int!, $offset: Int!, $from: ISO8601DateTime, $till: ISO8601DateTime) {
    ethereum(network: $network) {
      sender: transfers(
        options: {desc: "block.height", limit: $limit, offset: $offset}
        date: {since: $from, till: $till}
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
          name
          decimals
        }
        amount
        amountInUsd: amount(in: USD)
        transaction {
          hash
        }
        external
      }
      receiver: transfers(
        options: {desc: "block.height", limit: $limit, offset: $offset}
        date: {since: $from, till: $till}
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
          name
          decimals
        }
        amount
        amountInUsd: amount(in: USDT)
        transaction {
          hash
        }
        external
      }
    }
  }
`;

// DONE
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
          }
          history {
            timestamp
            value
          }
          value
        }
      }
    }
  }
`;

// trash
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

// export const SEARCH = gql`
//   query($value: String!) {
//     search(string: $value){
//       subject {
//         ... on Address {
//           address
//           annotation
//         }
//         ... on Currency {
//           symbol
//           name
//           address
//           tokenId
//           tokenType
//           decimals
//         }
//         ... on SmartContract {
//           address
//           annotation
//           contractType
//           protocol
//         }
//         ... on TransactionHash {
//           hash
//         }
//       }
//     }
//   }
// `;

export const BITQUERY_SEARCH = gql`
  query ($network: EthereumNetwork!, $exchangeName: String!, $addresses: [String!]) {
    ethereum(network: $network) {
      dexTrades(exchangeName: {is: $exchangeName}, baseCurrency: {in: $addresses}) {
        baseCurrency {
          address
          decimals
          symbol
          name
        }
        quoteCurrency {
          address
          decimals
          symbol
          name
        }
        smartContract {
          address {
            address
          }
        }
      }
    }
  }
`

export const BITQUERY_TOKEN_INFO = gql`
  query ($network: EthereumNetwork!, $address: String!) {
    ethereum(network: $network) {
      address(address: {is: $address}) {
        annotation
        address
        smartContract {
          contractType
          currency {
            symbol
            name
            decimals
            tokenType
          }
        }
        balance
      }
    }
  }
`;

export const BITQUERY_TOKEN_STATISTICS = gql`
  query ($network: EthereumNetwork!, $address: String!, $from: ISO8601DateTime, $till: ISO8601DateTime) {
    ethereum(network: $network) {
      transfers(
        currency: {is: $address}
        amount: {gt: 0}
        date: {since: $from, till: $till}
      ) {
        currency {
          address
          symbol
        }
        median: amount(calculate: median)
        average: amount(calculate: average)
        amount
        count
        days: count(uniq: dates)
        sender_count: count(uniq: senders)
        receiver_count: count(uniq: receivers)
        min_date: minimum(of: date)
        max_date: maximum(of: date)
      }
    }
  }
`;

export const BITQUERY_MINT_BURN = gql`
  query ($network: EthereumNetwork!, $address: String, $limit: Int!) {
    ethereum(network: $network) {
      mint: smartContractEvents(
        smartContractAddress: {is: $address}
        smartContractEvent: {is: "Mint"}
        options: {limit: $limit, desc: "block.height"}
      ) {
        block {
          height
          timestamp {
            time(format: "%Y-%m-%d %H:%M:%S")
          }
        }
        transaction {
          hash
        }
        arguments {
          argument
          argumentType
          value
        }
      }
      burn: smartContractEvents(
        smartContractAddress: {is: $address}
        smartContractEvent: {is: "Burn"}
        options: {limit: $limit, desc: "block.height"}
      ) {
        block {
          height
          timestamp {
            time(format: "%Y-%m-%d %H:%M:%S")
          }
        }
        transaction {
          hash
        }
        arguments {
          argument
          argumentType
          value
        }
      }
    }
  }
`;

export const BITQUERY_CONTRACT_EVENT_BY_HASH = gql`
query ($network: EthereumNetwork!, $address: String, $hash: [String!]) {
  ethereum(network: $network) {
    smartContractEvents(txHash: {in: $hash}, smartContractAddress: {is: $address}) {
      arguments {
        argument
        value
        argumentType
      }
      smartContractEvent {
        name
      }
    }
  }
}
`;

// limit 10
export const BITQUERY_AFFILIATE_TRADES = gql`
query ($network: EthereumNetwork!, $sender: String!, $receiver: String!, $from: ISO8601DateTime, $till: ISO8601DateTime) {
  ethereum(network: $network) {
    transfers(
      date: {since: $from, till: $till}
      amount: {gt: 0}
      sender: {is: $sender}
      receiver: {is: $receiver}
    ) {
      amountUSD: amount(in: USD, calculate: sum)
      amount
      currency {
        address
        name
        symbol
        decimals
      }
      count(uniq: transfers)
    }
  }
}
`
//
// export const BITQUERY_TOP_PAIR = gql`
// `