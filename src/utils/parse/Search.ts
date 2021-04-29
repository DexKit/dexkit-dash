import { NETWORK } from "shared/constants/AppEnums";
import { Pair } from "types/app";

export function parseSearchData(data: any, network: NETWORK): Pair[] {

  if (data && (data.data[network].dexTrades.length > 0)) {
    return data.data[network].dexTrades.map((e: any) => {
      return {
        address: e.smartContract.address.address,
        token0: {
          name: e.baseCurrency.name,
          symbol: e.baseCurrency.symbol,
          address: e.baseCurrency.address,
          decimals: e.baseCurrency.decimals
        },
        token1: {
          name: e.quoteCurrency.name,
          symbol: e.quoteCurrency.symbol,
          address: e.quoteCurrency.address,
          decimals: e.quoteCurrency.decimals
        }
      }
    });
  }
  
  return [];
}
