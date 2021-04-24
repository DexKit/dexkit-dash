import { NETWORK } from "shared/constants/Bitquery";
import { PairInfoExplorer } from "types/app";

export function parsePairExplorerData(data: any, address: string, network: NETWORK): PairInfoExplorer {

  if (data && data.data[network]) {
    const d24Current = data.data[network].data24[0];
    const d24Yesterday = data.data[network].data24[1];
    if(d24Current && d24Yesterday){
      const pooled = data.data[network].pooled[0].balances || [];

      const basePerDolar = d24Current.baseAmountInUsd/ d24Current.baseAmount;
      const quotePerDolar = d24Current.quoteAmountInUsd / d24Current.quoteAmount;

      const basePooled: number  = pooled.filter((e: any) => e.currency.symbol == d24Current.baseCurrency.symbol)[0].value;
      const quotePooled: number = pooled.filter((e: any) => e.currency.symbol == d24Current.quoteCurrency.symbol)[0].value;

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
        liquidity: ((basePooled * basePerDolar) + (quotePooled * quotePerDolar)),
        volume24: d24Current.tradeAmount,
        volume24InUsd: d24Current.tradeAmountInUsd,
        basePooled: basePooled,
        quotePooled: quotePooled, 
      }
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
    liquidity: 0,
    volume24: 0,
    volume24InUsd: 0,
    basePooled: 0,
    quotePooled: 0,  
  }
  
}