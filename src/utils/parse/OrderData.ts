import { NETWORK } from "shared/constants/AppEnums";
import { OrderData } from "types/app";

export function parseOrderData(data: any, network: NETWORK): OrderData[] {
  // if (data && data.data[network].dexTrades && data.data[network].dexTrades.length > 0) {
  if (data && data.data.ethereum.dexTrades && data.data.ethereum.dexTrades.length > 0) {
    const trades = data.data.ethereum.dexTrades;

    return trades.map((e: any) => {
        return {
          hash: e.transaction.hash,
          block: e.block.height,
          side: e.side,
          exchange: e.exchange.fullName,
          contract: e.smartContract.address.address,
          protocol: e.protocol,
          baseAmount: e.baseAmount,
          baseAmountUsd: e.baseAmountInUsd,
          baseToken: {
            name: e.baseCurrency.name,
            symbol: e.baseCurrency.symbol,
            address: e.baseCurrency.address,
            decimals: e.baseCurrency.decimals
          },
          quoteAmount: e.quoteAmount,
          quoteAmountUsd: e.quoteAmountInUsd,
          quotePrice: e.quotePrice,
          quoteToken: {
            name: e.quoteCurrency.name,
            symbol: e.quoteCurrency.symbol,
            address: e.quoteCurrency.address,
            decimals: e.quoteCurrency.decimals
          },
          tradeAmount: e.tradeAmount,
          tradeAmountUsd: e.tradeAmountIsUsd,
          created: e.block.timestamp.time
        }  
      });
  }
  
  return [];
}