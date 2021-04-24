import { NETWORK, EXCHANGE } from "shared/constants/Bitquery";
import { OrderData } from "types/app";
import { client } from "..";
import { parseOrderData } from "utils/parse";
import { BITQUERY_PAIR_TRADES } from "./gql";



export function getPairTrades(network: NETWORK, exchangeName: EXCHANGE, address: string, quoteAddress: string|null, limit: number, offset: number, from: Date|null, till: Date|null): Promise<OrderData[]>
{
  const variables: any = {
    network,
    exchangeName,
    address,
    quoteAddress,
    limit,
    offset,
    from: from ? from.toISOString() : null,
    till: till ? till.toISOString() : null
  }

  if (exchangeName === EXCHANGE.ALL) {
    delete variables.exchangeName;
  }

  return client.query({ query: BITQUERY_PAIR_TRADES, variables })
    .then(orders => { return parseOrderData(orders, network) })
    .catch(e => { return parseOrderData(null, network) });
}