import { NETWORK, EXCHANGE } from "shared/constants/Bitquery";
import { OrderData, AMMPairInfoExplorer, PairInfoExplorer } from "types/app";
import { client } from "..";
import { parseOrderData, parsePairExplorerData } from "utils/parse";
import { BITQUERY_PAIR_TRADES, BITQUERY_TOTAL_TOKEN_TRADES } from "./gql";
import { BITQUERY_TOTAL_CONTRACT_EVENTS, BITQUERY_PAIR_EXPLORER, BITQUERY_AMM_PAIR_EXPLORER } from "./amm.gql";
import { parseAMMPairExplorerData } from "utils/parse/AMMPairExplorer";



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

type contractEvent = "Mint" | "Burn"

export function getContractTotalEvents(network: NETWORK, exchangeName: EXCHANGE, address: string, events: contractEvent[]): Promise<{totalEvents: number}>
{
  const variables: any = {
    network,
    exchangeName,
    address,
    events,
  }

  if (exchangeName === EXCHANGE.ALL) {
    delete variables.exchangeName;
  }
  console.log(variables);

  return client.query({ query: BITQUERY_TOTAL_CONTRACT_EVENTS, variables })
  .then(data => {  return {totalEvents: data.data[network].smartContractEvents[0].totalEvents} })
  .catch(e => {  return {totalEvents: 0} });
}


export function getTotalTokenTrades(network: NETWORK, exchangeName: EXCHANGE, baseAddress: string| null, quoteAddress: string |null,  from: Date|null, till: Date|null): Promise<{totalTrades: number}>
{
  const variables: any = {
    network,
    exchangeName,
    baseAddress,
    quoteAddress,
    from: from ? from.toISOString() : null,
    till: till ? till.toISOString() : null
  }

  if (exchangeName === EXCHANGE.ALL) {
    delete variables.exchangeName;
  }
  if(!baseAddress){
    delete variables.baseAddress;
  }
  if(!quoteAddress){
    delete variables.quoteAddress;
  }
  console.log(variables)

  return client.query({ query: BITQUERY_TOTAL_TOKEN_TRADES, variables })
    .then(data => { return {totalTrades: data.data[network].dexTrades[0].totalTrades}})
    .catch(e => { console.log(e); return {totalTrades: 0}});
}

export function getAMMPairExplorer(network: NETWORK, exchangeName: EXCHANGE, pairAddress: string, quoteAddress: string|null): Promise<AMMPairInfoExplorer>
{
  const variables: any = {
    network,
    exchangeName,
    pairAddress,
    quoteAddress
  }

  if (exchangeName == EXCHANGE.ALL) {
    delete variables.exchangeName;
  }
  
  return client.query({ query: BITQUERY_AMM_PAIR_EXPLORER, variables })
    .then(orders => {  return parseAMMPairExplorerData(orders, pairAddress, network) })
    .catch(e => { console.log(e); return parseAMMPairExplorerData(null, pairAddress, network) });
}

export function getPairExplorer(network: NETWORK, exchangeName: EXCHANGE, baseAddress: string, quoteAddress: string|null): Promise<PairInfoExplorer>
{
  const variables: any = {
    network,
    exchangeName,
    baseAddress,
    quoteAddress
  }

  if (exchangeName == EXCHANGE.ALL) {
    delete variables.exchangeName;
  }
  
  return client.query({ query: BITQUERY_PAIR_EXPLORER, variables })
    .then(orders => {  return parsePairExplorerData(orders, baseAddress, network) })
    .catch(e => { console.log(e); return parsePairExplorerData(null, baseAddress, network) });
}