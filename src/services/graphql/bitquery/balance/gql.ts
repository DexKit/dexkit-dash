import {gql} from '@apollo/client';

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
            tokenType
          }
          value
          valueInUsd: value
        }
      }
    }
  }
`;

export const BITQUERY_SINGLE_BALANCE_INFO = gql`
  query GetSingleBalance(
    $network: EthereumNetwork!
    $address: String!
    $currency: String!
  ) {
    ethereum(network: $network) {
      address(address: {is: $address}) {
        balances(currency: {is: $currency}) {
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

export const BITQUERY_ALL_BALANCE_INFO = gql`
  query GetAllMyBalance($address: String!) {
    ethereum(network: ethereum) {
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
          valueInUsd: value
        }
      }
    }
    bsc: ethereum(network: bsc) {
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
          valueInUsd: value
        }
      }
    },
    matic: ethereum(network: matic) {
      address(address: {is: $address}) {
        balances{
          currency {
            name
            symbol
            decimals
            address
            tokenType
          }
          value
          valueInUsd: value
        }
      }
    }
  }
`;

export const BITQUERY_BALANCE_HISTORY = gql`
  query GetMyBalanceHistory(
    $network: EthereumNetwork!
    $address: String!
    $block: Int!
  ) {
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
`;

export const BITQUERY_SINGLE_BALANCE_HISTORY = gql`
  query GetMySingleBalanceHistory(
    $network: EthereumNetwork!
    $address: String!
    $block: Int!
    $currency: String!
  ) {
    ethereum(network: $network) {
      address(address: {is: $address}) {
        balances(height: {gteq: $block}, currency: {is: $currency}) {
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
            tokenType
          }
        }
      }
    }
  }
`;

export const BITQUERY_BALANCE_BLOCK = gql`
  query GetBalanceBlock($date: ISO8601DateTime!) {
    ethereum(network: ethereum) {
      blocks(date: {is: $date}, options: {limit: 1}) {
        height
      }
    }
  }
`;
