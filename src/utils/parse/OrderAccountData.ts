import { NETWORK } from "shared/constants/AppEnums";
import { OrderData } from "types/app";

export function parseOrderAccountData(data: any, network: NETWORK): OrderData[] {

  if (data && (data.data[network].maker.length > 0 || data.data[network].taker.length > 0)) {
    const makerTrades: any[] = data.data[network].maker;
    const takerTrades: any[] = data.data[network].taker;

    return makerTrades.concat(takerTrades).sort((a, b) => (a.block.height - b.block.height))
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
        }  
      });
  }
  
  return [];
}