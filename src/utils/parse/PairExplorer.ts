import { NETWORK } from "shared/constants/Bitquery";
import { PairInfoExplorer } from "types/app";

export function parsePairExplorerData(data: any, address: string, network: NETWORK): PairInfoExplorer {

  console.log('query', data);

  if (data && data[network]) {
    const d24 = data[network].data24[0];
    const info = data[network].dexTrades[0];
    const pooled = data[network].pooled[0].balances;

    console.log('24', d24);
    console.log('info', info);
    console.log('pooled', pooled);

    return {
      baseToken: {
        address: info.baseCurrency.address,
        name: info.baseCurrency.name,
        symbol: info.baseCurrency.symbol,
        decimals: info.baseCurrency.decimals
      },
      quoteToken: {
        address: info.quoteCurrency.address,
        name: info.quoteCurrency.name,
        symbol: info.quoteCurrency.symbol,
        decimals: info.quoteCurrency.decimals
      },
      address,
      price: 0, //info.quotePrice,
      priceUsd: 0, //info.quotePrice, //?
      priceChange: 0,
      liquidity: 0,
      volume24: d24.tradeAmount,
      basePooled: pooled.filter((e: any) => e.currency.symbol == info.baseCurrency.symbol)[0].value,
      quotePooled: pooled.filter((e: any) => e.currency.symbol == info.quoteCurrency.symbol)[0].value, 
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
    basePooled: 0,
    quotePooled: 0,  
  }
  
}