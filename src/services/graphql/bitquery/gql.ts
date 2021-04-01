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

  export const BITQUERY_ORDER_HISTORY = gql `query(
    $address: String!, $limit: Int=10, $exchangeName: String="Uniswap", $baseAmount: String="USD", $quoteAmount: String="USD"
    ){
    ethereum {
      dexTrades(
        options: {limit: $limit},
        exchangeName: {is:$exchangeName}
        taker: {is: $address}
      ) {
        side
        
        baseAmount
        baseAmountInUSD: baseAmount(in:$baseAmount)
        baseCurrency {
          name
          symbol
        }
        
        quoteAmount
        quoteAmountInUSD: quoteAmount(in:$quoteAmount)
        quoteCurrency {
          name
          symbol
        }
        transaction{
          hash
        }
      }
    }
  }`;

  export const BITQUERY_MY_TOKEN_BALANCE = gql `query (
    $network: EthereumNetwork!,
    $address: String!
  ) {
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

  export const BITQUERY_MY_TOKEN_BALANCE_AT = gql `query (
    $network: EthereumNetwork!,
    $address: String!,
    $date: ISO8601DateTime!
  ) {
    ethereum(network: $network) {
      address(address: {is: $address}) {
        balances(date: {till: $date}) {
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
  }`;

  export const SEARCH = gql`query($value: String!) {
    search(string: $value, network: ethereum){
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
  `

  