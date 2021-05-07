import { NETWORK } from "shared/constants/AppEnums";
import { OrderData } from "types/app";

export function parseOrderAccountData(data: any, network: NETWORK): {orders: OrderData[], total: number} {

  if (data && (data.data[network].maker.length > 0 || data.data[network].taker.length > 0)) {
    const makerTrades: any[] = data.data[network].maker;
    const takerTrades: any[] = data.data[network].taker;
    const total = data.data[network].makerCount[0].count + data.data[network].takerCount[0].count;
    const allOrders = makerTrades.concat(takerTrades);
    return {
      orders: allOrders
      .sort((a, b) => (b.block.height - a.block.height))
      .filter((thing, index, self) =>
        index === self.findIndex((t) => (
          t.transaction.hash === thing.transaction.hash
        ))
      )
      // API is returning both sides, filtering by hash
      .map<OrderData>((e) => {
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
        }}), total}   
     
  }
  
  return {orders: [], total: 0};
}