import { OrderByPairs } from "types/app";

export function parseOrderByPairData(data: any): OrderByPairs[] {
  console.log(data);

  if (data && data.data.ethereum.dexTrades && data.data.ethereum.dexTrades.length > 0) {
    
    const trades = data.data.ethereum.dexTrades;
    
    return trades.map((e: any) => {
      return {
        sellToken: {
          symbol: e.sellCurrency.symbol,
          address: e.sellCurrency.address
        },
        buyToken: {
          symbol: e.buyCurrency.symbol,
          address: e.buyCurrency.address
        },
        sellAmount: e.sellAmount,
        buyAmount: e.buyAmount,
        medianPrice: e.median_price,
        lastPrice: parseFloat(e.last_price) || 0,
        tradeCount: e.count,
        daysTraded: e.dates,
        started: e.started
      }  
    });
  }

  return [];
}