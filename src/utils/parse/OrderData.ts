import { OrderData } from "types/app";

export function parseOrderData(data: any): OrderData[] {
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
        sellAmountUsd: e.sellAmountInUsd,
        sellToken: {
          symbol: e.sellCurrency.symbol,
          address: e.sellCurrency.address
        },
        buyAmountUsd: e.buyAmountInUsd,
        buyToken: {
          symbol: e.buyCurrency.symbol,
          address: e.buyCurrency.address
        },
        created: e.block.timestamp.time
      }  
    })
  }
  return [];
}