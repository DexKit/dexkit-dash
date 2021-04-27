import { ApolloClient, ApolloQueryResult, InMemoryCache } from '@apollo/client';
import { EXCHANGE, NETWORK } from 'shared/constants/AppEnums';
import { GET_EXCHANGE_NAME } from 'shared/constants/Bitquery';
import { OrderByPairs, OrderByToken, OrderData, PairInfoExplorer, Token, TokenStatistic, TransferByAddress } from 'types/app';
import { parseTokenInfoData, parseOrderByPairData, parseOrderByTokenData, parseOrderData, parsePairExplorerData, parseTransferByAddressData, parseSearchData } from 'utils/parse';
import { parseMintBurnData, parseOrderAccountData, parseTokenStatisticsData } from 'utils/parse';
import { parseEventContractData } from 'utils/parse/ContractEvent';
import {
  BITQUERY_PAIR_EXPLORER,
  BITQUERY_CONTRACT_ORDERS,
  BITQUERY_TOKEN_ORDERS,
  BITQUERY_MY_ORDERS,
  BITQUERY_MY_TRANSFERS,
  BITQUERY_MY_TOKEN_BALANCE,
  BITQUERY_MY_TOKEN_BALANCE_AT,
  BITQUERY_ORDERS_BY_TOKENS,
  BITQUERY_ORDERS_BY_PAIRS,
  BITQUERY_TOKEN_INFO,
  BITQUERY_TOKEN_STATISTICS,
  BITQUERY_MINT_BURN,
  BITQUERY_ORDERS_BY_HASH,
  BITQUERY_CONTRACT_EVENT_BY_HASH,
  BITQUERY_SEARCH
} from './gql';

export const client = new ApolloClient({
  uri: 'https://dexkit.graphql.bitquery.io',
  cache: new InMemoryCache(),
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT x.y; Win64; x64; rv:10.0) Gecko/20100101 Firefox/10.0',
    'Access-Control-Allow-Origin': '*.bitquery.io/*'
  }
});

export function getPairExplorer(network: NETWORK, exchangeName: EXCHANGE, pairAddress: string, quoteAddress: string|null): Promise<PairInfoExplorer>
{
  const variables: any = {
    network,
    exchangeName: GET_EXCHANGE_NAME(exchangeName),
    pairAddress,
    quoteAddress
  }

  if (exchangeName == EXCHANGE.ALL) {
    delete variables.exchangeName;
  }

  return client.query({ query: BITQUERY_PAIR_EXPLORER, variables })
    .then(orders => { return parsePairExplorerData(orders, pairAddress, network) })
    .catch(e => { return parsePairExplorerData(null, pairAddress, network) });
}

export function getContractOrders(network: NETWORK, exchangeName: EXCHANGE, address: string, quoteAddress: string|null, limit: number, offset: number, from: Date|null, till: Date|null): Promise<OrderData[]>
{
  const variables: any = {
    network,
    exchangeName: GET_EXCHANGE_NAME(exchangeName),
    address,
    quoteAddress,
    limit,
    offset,
    from: from ? from.toISOString() : null,
    till: till ? till.toISOString() : null
  }

  if (exchangeName == EXCHANGE.ALL) {
    delete variables.exchangeName;
  }

  return client.query({ query: BITQUERY_CONTRACT_ORDERS, variables })
    .then(orders => { return parseOrderData(orders, network) })
    .catch(e => { return parseOrderData(null, network) });
}

export function getTokenOrders(network: NETWORK, exchangeName: EXCHANGE, address: string, limit: number, offset: number, from: Date|null, till: Date|null): Promise<OrderData[]>
{
  const variables: any = {
    network,
    exchangeName: GET_EXCHANGE_NAME(exchangeName),
    address,
    limit,
    offset,
    from: from ? from.toISOString() : null,
    till: till ? till.toISOString() : null
  }

  if (exchangeName == EXCHANGE.ALL) {
    delete variables.exchangeName;
  }

  return client.query({ query: BITQUERY_TOKEN_ORDERS, variables })
    .then(orders => { return parseOrderData(orders, network) })
    .catch(e => { return parseOrderData(null, network) });
}

export function getMyOrders(network: NETWORK, exchangeName: EXCHANGE, address: string, limit: number, offset: number, from: Date|null, till: Date|null): Promise<OrderData[]>
{
  const variables: any = {
    network,
    exchangeName: GET_EXCHANGE_NAME(exchangeName),
    address,
    limit,
    offset,
    from: from ? from.toISOString() : null,
    till: till ? till.toISOString() : null
  }

  if (exchangeName == EXCHANGE.ALL) {
    delete variables.exchangeName;
  }

  return client.query({ query: BITQUERY_MY_ORDERS, variables })
    .then(orders => { return parseOrderAccountData(orders, network) })
    .catch(e => { return parseOrderAccountData(null, network) });
}

export function getOrdersByPairs(network: NETWORK, exchangeName: EXCHANGE, limit: number, offset: number, from: Date|null, till: Date|null): Promise<OrderByPairs[]>
{
  const variables: any = {
    network,
    exchangeName: GET_EXCHANGE_NAME(exchangeName),
    limit,
    offset,
    from: from ? from.toISOString() : null,
    till: till ? till.toISOString() : null
  }

  if (exchangeName == EXCHANGE.ALL) {
    delete variables.exchangeName;
  }

  return client.query({ query: BITQUERY_ORDERS_BY_PAIRS, variables })
    .then(orders => { return parseOrderByPairData(orders) })
    .catch(e => { return parseOrderByPairData(null) });  
}

export function getOrdersByTokens(network: NETWORK, exchangeName: EXCHANGE, limit: number, offset: number, from: Date|null, till: Date|null): Promise<OrderByToken[]>
{
  const variables: any = {
    network,
    exchangeName: GET_EXCHANGE_NAME(exchangeName),
    limit,
    offset,
    from: from ? from.toISOString() : null,
    till: till ? till.toISOString() : null
  }

  if (exchangeName == EXCHANGE.ALL) {
    delete variables.exchangeName;
  }

  return client.query({ query: BITQUERY_ORDERS_BY_TOKENS, variables })
    .then(orders => { return parseOrderByTokenData(orders) })
    .catch(e => { return parseOrderByTokenData(null) });  
}

export function getOrderByHash(network: NETWORK, address: string) {
  const variables: any = {
    network,
    address
  }

  return client.query({ query: BITQUERY_ORDERS_BY_HASH, variables })
    .then(orders => { return parseOrderData(orders, network) })
    .catch(e => { return parseOrderData(null, network) });  
}

export function getMyTransfers(network: NETWORK, address: string, limit: number, offset: number, from: Date|null, till: Date|null): Promise<TransferByAddress[]>
{
  return client.query({
    query: BITQUERY_MY_TRANSFERS,
    variables: {
      network,
      address,
      limit,
      offset,
      from: from ? from.toISOString() : null,
      till: till ? till.toISOString() : null
    }
  })
    .then(orders => { return parseTransferByAddressData(orders, network); })
    .catch(e => { console.log(e); return parseTransferByAddressData(null, network) });
}

export function getMyTokenBalances<T>(network: NETWORK, address: string): Promise<ApolloQueryResult<T>>
{
  return client.query({
    query: BITQUERY_MY_TOKEN_BALANCE,
    variables: {
      network,
      address
    }
  });
}

export function getMyTokenBalancesAt<T>(network: string, address: string, till: Date): Promise<ApolloQueryResult<T>>
{
  return client.query({
    query: BITQUERY_MY_TOKEN_BALANCE_AT,
    variables: {
      network,
      address,
      till: till ? till.toISOString() : null
    }
  });
}

export function getTokenInfo(network: NETWORK, address: string): Promise<Token>
{
  return client.query({
    query: BITQUERY_TOKEN_INFO,
    variables: {
      network,
      address
    }
  }).then(data => {
    return parseTokenInfoData(data);
  }).catch(e => {
    return parseTokenInfoData(null);
  });
}

export function getTokenStatistics(network: NETWORK, address: string, from: Date|null, till: Date|null): Promise<TokenStatistic>
{
  return client.query({
    query: BITQUERY_TOKEN_STATISTICS,
    variables: {
      network,
      address,
      from: from ? from.toISOString() : null,
      till: till ? till.toISOString() : null
    }
  }).then(data => {
    return parseTokenStatisticsData(data);
  }).catch(e => {
    return parseTokenStatisticsData(null);
  });
}

export async function getPool(network: NETWORK, exchangeName: EXCHANGE, pairAddress: string, quoteAddress: string|null, limit: number) {

  try {
    const pair = (await getContractOrders(network, exchangeName, pairAddress, quoteAddress, 1, 0, null, null))[0];

    let data: any = await client.query({
      query: BITQUERY_MINT_BURN,
      variables: {
        network,
        address: pairAddress,
        limit
      } 
    });

    const list = parseMintBurnData(data, pairAddress, network);

    const mintHash: string[] = list.mint.map(e => e.hash);
    const burnHash: string[] = list.burn.map(e => e.hash);

    data = await client.query({
      query: BITQUERY_CONTRACT_EVENT_BY_HASH,
      variables: {
        network,
        address: pairAddress,
        hash: mintHash.concat(burnHash)
      }
    });

    return parseEventContractData(data, list.mint, list.burn, network, pair);
  } catch(e) {
    console.log(e)
    return [];
  };

}

export function search(network: NETWORK, exchangeName: EXCHANGE, addresses: string[]) {
  return client.query({
    query: BITQUERY_SEARCH,
    variables: {
      network,
      exchangeName: GET_EXCHANGE_NAME(exchangeName),
      addresses
    }
  }).then(data => {
    return parseSearchData(data, network);
  }).catch(e => {
    return parseSearchData(null, network);
  });
}