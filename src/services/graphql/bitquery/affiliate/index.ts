import { gql } from "@apollo/client/core";

export const BITQUERY_AFFILIATE_TRADES = gql`
query GetAffiliateTrades($network: EthereumNetwork!, $limit: Int!, $offset: Int!, $sender: String!, $receiver: String!, $from: ISO8601DateTime, $till: ISO8601DateTime) {
    ethereum(network: $network) {
      transfers(
       options: {desc: "block.height", limit: $limit, offset: $offset}
       date: {since: $from, till: $till}
       amount: {gt: 0},
       sender: {is: $sender} 
       receiver: {is: $receiver}) 
       {
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
        }
        amount
        amountUsd: amount(in: USD)
        transaction {
          hash
        }
        external
      }
    }
  }`

  // limit 10
export const BITQUERY_TOTAL_AFFILIATE_TRADES = gql`
query GetTotalAffiliateTrades($network: EthereumNetwork!, $sender: String!, $receiver: String!, $from: ISO8601DateTime, $till: ISO8601DateTime) {
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