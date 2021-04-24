import { NETWORK } from "shared/constants/Bitquery";
import {  TokenPair } from "types/app";

export function parseTokenPairsData(data: any, address: string, network: NETWORK): TokenPair[] {

  console.log(data);

  if (data && data.data[network]) {
    return data.data[network].data24.map((d: any) => {
  
      const basePerDolar = d.baseAmountInUsd / d.baseAmount;
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
        priceUsd: (d.quotePrice * quotePerDolar),
        priceChange: 0, 
        volume24: d.tradeAmount,
        volume24InUsd: d.tradeAmountInUsd,
        quoteVolume24: d.quoteAmount,
        baseVolume24: d.baseAmount,
        trades: d.trades,
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
    volume24: 0,
    volume24InUsd: 0,
    baseVolume24: 0,
    quoteVolume24: 0,
    trades: 0
  }]
  
}