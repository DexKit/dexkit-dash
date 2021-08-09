export const endpoint = 'https://graphql.bitquery.io';

export const GET_COIN_INFO = `
query GET_COIN_INFO($tokenAddress: String, $network: EthereumNetwork) {
  ethereum(network: $network) {
    dexTrades(
      options: {desc: ["block.height", "transaction.index"], limit: 1}
      baseCurrency: {is: $tokenAddress}
    ) 
    {
      block {
        height
        timestamp {
          time(format: "%Y-%m-%d %H:%M:%S") 
        }
      }
      transaction {
        index
      }
      baseCurrency {
        name
        symbol
        decimals
      }
    }
  }
}
`;

export const GET_COIN_BARS = `
query ($from: ISO8601DateTime!, $to: ISO8601DateTime!, $interval: Int!, $tokenAddress: String) {
  ethereum(network: bsc) {
    dexTrades(
      options: {asc: "timeInterval.minute"}
      date: {since: $from, till: $to}
      exchangeAddress: {is: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73"}
      baseCurrency: {is: $tokenAddress},
      quoteCurrency: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"},
      tradeAmountUsd: {gt: 10}
    ) 
    {
      timeInterval {
        minute(count: $interval, format: "%Y-%m-%dT%H:%M:%SZ")  
      }
      volume: quoteAmount
      high: quotePrice(calculate: maximum)
      low: quotePrice(calculate: minimum)
      open: minimum(of: block, get: quote_price)
      close: maximum(of: block, get: quote_price) 
    }
  }
}
`;

export const GET_COIN_BARS_USDT = `
query GetCoinBars($network: EthereumNetwork!, $from: ISO8601DateTime!, $to: ISO8601DateTime!, $interval: Int!, $base: String,   $wrappedNative: String,  $usdReference: String ) {
  ethereum(network: $network) {
    dexTrades(
      options: {asc: "timeInterval.minute"}
      date: {since: $from, till: $to}
      any: [
        {
         baseCurrency: {is: $base}
         quoteCurrency: {is: $wrappedNative} 
        },
        {
         baseCurrency: {is: $wrappedNative}
         quoteCurrency: {is: $usdReference}
        }
       ]
      tradeAmountUsd: {gt: 10}
    ) 
    {
      timeInterval {
        minute(count: $interval, format: "%Y-%m-%dT%H:%M:%SZ")  
      }
      volume: quoteAmount
      high: quotePrice(calculate: maximum)
      low: quotePrice(calculate: minimum)
      open: minimum(of: block, get: quote_price)
      close: maximum(of: block, get: quote_price) 
      baseCurrency {
        symbol
        address
      }
      baseAmount
      quoteCurrency {
        symbol
        address
      }
    }
  }
}
`;

export const GET_COIN_BARS_NATIVE_USDT = `
query GetCoinBars($network: EthereumNetwork!, $from: ISO8601DateTime!, $to: ISO8601DateTime!, $interval: Int!,  $wrappedNative: String,  $usdReference: String ) {
  ethereum(network: $network) {
    dexTrades(
      options: {asc: "timeInterval.minute"}
      date: {since: $from, till: $to}
      baseCurrency: {is: $wrappedNative}
      quoteCurrency: {is: $usdReference}
      tradeAmountUsd: {gt: 10}
      priceAsymmetry: {lt: 0.05}
    ) 
    {
      timeInterval {
        minute(count: $interval, format: "%Y-%m-%dT%H:%M:%SZ")  
      }
      volume: quoteAmount
      high: quotePrice(calculate: maximum)
      low: quotePrice(calculate: minimum)
      open: minimum(of: block, get: quote_price)
      close: maximum(of: block, get: quote_price) 
      baseCurrency {
        symbol
        address
      }
      baseAmount
      quoteCurrency {
        symbol
        address
      }
    }
  }
}
`;
