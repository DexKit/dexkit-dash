
import {  TokenPair, PairInfoExplorer } from "types/app";
import { NETWORK } from "shared/constants/AppEnums";

export function parseTokenPairsData(data: any, address: string, network: NETWORK): TokenPair[] {

  if (data && data.data[network]) {
    return data.data[network].data24.map((d: any) => {

      const quotePerDolar = d.quoteAmountInUsd / d.quoteAmount;

      return {
        baseToken: {
          address: d.baseCurrency.address,
          name: d.baseCurrency.name,
          symbol: d.baseCurrency.symbol,
          decimals: d.baseCurrency.decimals
        },
        quoteToken: {
          address: d.quoteCurrency.address,
          name: d.quoteCurrency.name,
          symbol: d.quoteCurrency.symbol,
          decimals: d.quoteCurrency.decimals
        },
        address: d.smartContract.address.address,
        price: d.quotePrice,
        closePrice: Number(d.close_price),
        closePriceUsd:  (d.close_price * quotePerDolar),
        priceUsd: (d.quotePrice * quotePerDolar),
        priceChange: 0, 
        volume24: d.tradeAmount,
        volume24InUsd: d.tradeAmountInUsd,
        quoteVolume24: d.quoteAmount,
        baseVolume24: d.baseAmount,
        trades: d.trades,
        protocol: d.protocol,
        exchange: d.exchange.name,
      }
    })
  }

  return [{
    baseToken: {
      address: '0x',
      name: '-',
      symbol: '-',
      decimals: 18
    },
    quoteToken: {
      address: '0x',
      name: '-',
      symbol: '-',
      decimals: 18
    },
    address: '0x',
    price: 0,
    priceUsd: 0,
    closePrice: 0,
    closePriceUsd: 0,
    volume24: 0,
    volume24InUsd: 0,
    baseVolume24: 0,
    quoteVolume24: 0,
    trades: 0,
    protocol:'',
    exchange: ''
  }]
  
}

export function parseTokenPairDailyData(data: any, address: string, network: NETWORK): PairInfoExplorer {

  if (data && data.data[network] && data.data[network].data24.length > 0) {
      const d = data.data[network].data24[0];
      const quotePerDolar = d.quoteAmountInUsd / d.quoteAmount;
      const priceChange = Number(d.open_price) !== 0 ? (Number(d.close_price) - Number(d.open_price))/ (Number(d.open_price)) : 0;

      return {
        baseToken: {
          address: d.baseCurrency.address,
          name: d.baseCurrency.name,
          symbol: d.baseCurrency.symbol,
          decimals: d.baseCurrency.decimals
        },
        quoteToken: {
          address: d.quoteCurrency.address,
          name: d.quoteCurrency.name,
          symbol: d.quoteCurrency.symbol,
          decimals: d.quoteCurrency.decimals
        },
        address: ' ',
        price: Number(d.close_price),
        priceUsd: (Number(d.close_price) * quotePerDolar),
        priceChange: priceChange,
        volume24: d.tradeAmount,
        volume24InUsd: d.tradeAmountInUsd,
        totalTrades: d.trades,
        baseAmount: d.baseAmount,
        quoteAmount: d.quoteAmount
      } 
    }
  

  return {
    baseToken: {
      address: '0x',
      name: '-',
      symbol: '-',
      decimals: 18
    },
    quoteToken: {
      address: '0x',
      name: '-',
      symbol: '-',
      decimals: 18
    },
    address: '0x',
    price: 0,
    priceUsd: 0,
    volume24: 0,
    volume24InUsd: 0,
    totalTrades:  0,
    baseAmount: 0,
    quoteAmount: 0,
    priceChange: 0,
  }
  
}