import { gql } from "@apollo/client";

export const BITQUERY_BALANCE_INFO = gql`
  query GetMyBalance($network: EthereumNetwork!, $address: String!) {
    ethereum(network: $network) {
      address(address: {is: $address}) {
        balances {
          currency {
            name
            symbol
            decimals
            address
          }
          value
          valueInUsd: value
        }
      }
    }
  }
`

export const BITQUERY_BALANCE_HISTORY = gql`
  query GetMyBalanceHistory($network: EthereumNetwork!, $address: String!, $block: Int!) {
    ethereum(network: $network) {
      address(address: {is: $address}) {
        balances(height: {gteq: $block}) {
          history {
            timestamp
            transferAmount
            value
            block
          }
          currency {
            name
            symbol
            decimals
            address
          }
        }
      }
    }
  }
`

export const BITQUERY_BALANCE_BLOCK = gql`
  query GetBalanceBlock($date: ISO8601DateTime!) {
    ethereum(network: ethereum) {
      blocks(date: {is: $date}, options: {limit: 1}) {
        height
      }
    }
  }
`
