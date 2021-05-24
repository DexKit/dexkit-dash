import { NETWORK } from "shared/constants/AppEnums";
import { PairInfoExplorer } from "types/app";

export function parsePairExplorerData(data: any, address: string, network: NETWORK): PairInfoExplorer {

  // if (data && data.data[network]) {
  if (data && data.data.ethereum) {
    const d24Current = data.data.ethereum.data24[0];
    const d24Yesterday = data.data.ethereum.data24[1];
    const quotePerDolar = d24Current.quoteAmountInUsd / d24Current.quoteAmount;

      return {
        baseToken: {
          address: d24Current.baseCurrency.address,
          name: d24Current.baseCurrency.name,
          symbol: d24Current.baseCurrency.symbol,
          decimals: d24Current.baseCurrency.decimals
        },
        quoteToken: {
          address: d24Current.quoteCurrency.address,
          name: d24Current.quoteCurrency.name,
          symbol: d24Current.quoteCurrency.symbol,
          decimals: d24Current.quoteCurrency.decimals
        },
        address,
        price: d24Current.quotePrice,
        priceUsd: (d24Current.quotePrice * quotePerDolar),
        priceChange: ((d24Current.quotePrice * 100) / d24Yesterday.quotePrice) - 100,
        volume24: d24Current.tradeAmount,
        volume24InUsd: d24Current.tradeAmountInUsd,
        baseAmount: d24Current.baseAmount,
        quoteAmount: d24Current.quoteAmount,
        totalTrades: d24Current.trades,
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
    priceChange: 0,
    volume24: 0,
    volume24InUsd: 0,
    baseAmount: 0,
    quoteAmount: 0,
    totalTrades: 0
  }
  
}