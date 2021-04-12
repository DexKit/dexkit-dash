import { OrderByToken } from "types/app";

export function parseOrderByTokenData(data: any): OrderByToken[] {
  if (data && data.data.ethereum.dexTrades && data.data.ethereum.dexTrades.length > 0) {
    const trades = data.data.ethereum.dexTrades;
    return trades.map((e: any) => {
      return {
        token: {
          symbol: e.currency.symbol,
          address: e.currency.address
        },
        tradeCount: e.count,
        amountUsd: e.currencyAmount,
        daysTraded: e.dates,
        started: e.started
      }  
    })
  }
  return [];
}