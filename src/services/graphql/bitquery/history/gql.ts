import { gql } from "@apollo/client/core";

export const BITQUERY_TRANSACTION_INFO = gql`
  query GetTransactionInfo($network: EthereumNetwork!, $hash: String!) {
    ethereum(network: $network) {
      transactions(
        txHash: {is: $hash}
      ) {
        amount
        block {
          height
          timestamp {
            time(format: "%Y-%m-%d %H:%M:%S")
            unixtime
          }
        }
        count
        creates {
          address
        }
        currency {
          address
          decimals
          name
          symbol
          tokenId
        }
        error
        gas
        gasPrice
        gasValue
        hash
        success
        sender {
          address
        }
        to {
          address
        }
        nonce
        date {
          date
        }
        gasCurrency {
          address
          decimals
          name
          symbol
        }
        index
      }
    }
  }
`;

export const BITQUERY_ORDER_INFO = gql`
  query GetOrderInfo($network: EthereumNetwork!, $hash: String!) {
    ethereum(network: $network) {
      dexTrades(txHash: {is: $hash}) {
        baseAmount
        baseAmountInUSD: baseAmount(in: USD)
        baseCurrency {
          address
          decimals
          name
          symbol
          tokenId
        }
        block {
          hash
          height
          timestamp {
            time(format: "%Y-%m-%d %H:%M:%S")
            unixtime
          }
        }
        count
        date {
          date
        }
        exchange {
          fullName
          name
        }
        maker {
          address
        }
        protocol
        quoteAmount
        quoteAmountInUsd: quoteAmount(in: USD)
        quoteCurrency {
          address
          decimals
          name
          symbol
          tokenId
        }
        quotePrice
        side
        taker {
          address
        }
        tradeAmountInUsd: tradeAmount(in: USD)
        tradeIndex
        transaction {
          gas
          gasPrice
          gasValue
          hash
          index
          nonce
          to {
            address
          }
          txFrom {
            address
          }
        }
      }
    }
  }  
`;

export const BITQUERY_TRANSACTION_LIST = gql`
  query GetTransactionList($network: EthereumNetwork!, $address: String, $limit: Int!, $offset: Int!, $from: ISO8601DateTime, $till: ISO8601DateTime) {
    ethereum(network: $network) {
      sender: transfers(
        options: {desc: "block.height", limit: $limit, offset: $offset}
        date: {since: $from, till: $till}
        sender: {is: $address}
      ) {
        block {
          timestamp {
            time(format: "%Y-%m-%d %H:%M:%S")
            unixtime
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
      receiverCount: transfers(
        date: {since: $from, till: $till}
        receiver: {is: $address}
      ) {
        count
      }
      senderCount: transfers(
        date: {since: $from, till: $till}
        receiver: {is: $address}
      ) {
        count
      }
    }
  }
`;

export const BITQUERY_TRANSFER_LIST = gql`
  query GetTransferList($network: EthereumNetwork!, $address: String, $limit: Int!, $offset: Int!, $from: ISO8601DateTime, $till: ISO8601DateTime) {
    ethereum(network: $network) {
     transfers(
       any: [
          {    
            sender: {is: $address}
          },
          {    
            receiver: {is: $address}
          }]
        options: {desc: "block.height", limit: $limit, offset: $offset}
        date: {since: $from, till: $till}
      ) {
        block {
          timestamp {
            time(format: "%Y-%m-%d %H:%M:%S")
            unixtime
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
    }
  }
`;

export const BITQUERY_TRADE_HISTORY_LIST = gql`
  query GetTradeHistoryList($network: EthereumNetwork!, $exchangeName: String, $address: String!, $limit: Int!, $offset: Int!, $from: ISO8601DateTime, $till: ISO8601DateTime, $baseCurrency: String) {
    ethereum(network: $network) {
      dexTrades(
        options: {desc: ["block.height"], limit: $limit, offset: $offset}
        date: {since: $from, till: $till}
        exchangeName: {is: $exchangeName}
        any: [
          {    
            taker: {is: $address}
          },
          {    
            maker: {is: $address}
          },
        
      ]
        baseCurrency: {is: $baseCurrency}
      ) {
        block {
          timestamp {
            time(format: "%Y-%m-%d %H:%M:%S")
          }
          height
        }
        protocol
        transaction {
          hash
          index
          nonce
          txFrom {
            address
          }
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
        baseAmountInUsd: baseAmount(in: USD)
        baseCurrency {
          name
          address
          symbol
          decimals
        }
        quotePrice
        quoteAmount
        quoteAmountInUsd: quoteAmount(in: USD)
        quoteCurrency {
          name
          address
          symbol
          decimals
        }
        tradeAmount(in: ETH)
        tradeAmountIsUsd: tradeAmount(in: USD)
      }
      total: dexTrades(
        date: {since: $from, till: $till}
        exchangeName: {is: $exchangeName}
        any: [
          {    
            taker: {is: $address}
          },
          {    
            maker: {is: $address}
          },     
        ]
        baseCurrency: {is: $baseCurrency}
      ) {
        count
      }
    }
  }
`;


export const BITQUERY_ALL_TRADE_HISTORY_LIST = gql`
  query GetAllTradeHistoryList($network: EthereumNetwork!, $exchangeName: String, $address: String!, $limit: Int!, $offset: Int!, $from: ISO8601DateTime, $till: ISO8601DateTime) {
    ethereum(network: $network) {
      dexTrades(
        options: {desc: ["block.height"], limit: $limit, offset: $offset}
        date: {since: $from, till: $till}
        exchangeName: {is: $exchangeName}
        makerOrTaker: {is: $address}
      ) {
        block {
          timestamp {
            time(format: "%Y-%m-%d %H:%M:%S")
          }
          height
        }
        protocol
        transaction {
          hash
          index
          nonce
          txFrom {
            address
          }
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
        sellAmount
        sellCurrency {
          name
          address
          symbol
          decimals
        }
        buyAmount
        buyCurrency {
          name
          address
          symbol
          decimals
        }
        tradeAmount(in: ETH)
        tradeAmountInUsd: tradeAmount(in: USD)
      }
      total: dexTrades(
        date: {since: $from, till: $till}
        exchangeName: {is: $exchangeName}
        makerOrTaker: {is: $address}
      ) {
        count
      }
    }
  }
`;