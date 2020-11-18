import { gql } from '@apollo/client';

export const UNISWAP_GLOBAL_STATS = gql`
{
 uniswapFactory(id: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"){
   totalVolumeUSD
   totalLiquidityUSD
   txCount
 }
}
`

export const UNISWAP_ETH_PRICE = gql`
    {
        bundle(id:1){
            ethPrice
        }
    }
`
export const UNISWAP_TOKENS_DAY_DATA = gql`
   query tokenDayDatas($first: Int!, $skip: Int!, $timestamp: Int!, $orderBy: String!, $orderDirection: String!) {
      tokenDayDatas(first: $first, skip: $skip, orderBy: dailyVolumeUSD, orderDirection: desc
        where: {
         date_gt: $timestamp}
      ) {
        id
        token{
            id
            name
            symbol
        }
        dailyVolumeToken
        dailyVolumeETH
        dailyVolumeUSD
        dailyTxns
        totalLiquidityToken
        totalLiquidityETH
        totalLiquidityUSD
        priceUSD
      }
    }
`
export const UNISWAP_PAIRS_DAY_DATA = gql`
   query pairDayDatas($first: Int!, $skip: Int!, $timestamp: Int!, $orderBy: String!, $orderDirection: String!) {
      pairDayDatas(first: $first, skip: $skip, orderBy: dailyVolumeUSD, orderDirection: desc
        where: {
         date_gt: $timestamp}
      ) {
        id
        token0{
            id
            name
            symbol
        }
        token1{
            id
            name
            symbol
        }
        pairAddress
        reserveUSD
        dailyVolumeUSD
        dailyTxns
      }
    }
`


export const UNISWAP_TOKENS = gql`
   query tokens($skip: Int!) {
      tokens(first: 100, skip: $skip, orderBy: tradeVolumeUSD, orderDirection: desc) {
        id
        name
        symbol
        decimals
        derivedETH
        tradeVolumeUSD
        totalLiquidity
        mostLiquidPairs(first: 200, orderBy: reserveUSD, orderDirection: desc) {
          reserveUSD
        }
      }
    }
`

// https://uniswap.org/docs/v2/API/queries/#all-tokens-in-uniswap

export const UNISWAP_TOKENS_TRANSACTIONS = gql`
 query($allPairs: [Bytes]!) {
    mints(first: 30, where: { pair_in: $allPairs }, orderBy: timestamp, orderDirection: desc) {
      transaction {
        id
        timestamp
      }
      to
      liquidity
      amount0
      amount1
      amountUSD
    }
    burns(first: 30, where: { pair_in: $allPairs }, orderBy: timestamp, orderDirection: desc) {
      transaction {
        id
        timestamp
      }
      to
      liquidity
      amount0
      amount1
      amountUSD
    }
    swaps(first: 30, where: { pair_in: $allPairs }, orderBy: timestamp, orderDirection: desc) {
      transaction {
        id
        timestamp
      }
      amount0In
      amount0Out
      amount1In
      amount1Out
      amountUSD
      to
    }
   }
`
// https://uniswap.org/docs/v2/API/queries/#most-liquid-pairs
export const UNISWAP_PAIRS = gql`
    {
    pairs(first: 1000, orderBy: reserveUSD, orderDirection: desc) {
        token0{
        name
        } 
        token1{
        name
        }
        id
        volumeUSD
        txCount
        reserveETH
        reserve0
        reserve1
        reserveUSD
        liquidityProviderCount
        token0Price
        token1Price
      }
    }
`