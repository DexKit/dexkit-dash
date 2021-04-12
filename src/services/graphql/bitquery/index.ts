import { ApolloClient, ApolloQueryResult, InMemoryCache } from '@apollo/client';
import { EXCHANGE, NETWORK } from 'shared/constants/Bitquery';
import { OrderByPairs, OrderByToken, OrderData, Token, TokenStatistic } from 'types/app';
import { parseTokenInfoData, parseOrderByPairData, parseOrderByTokenData, parseOrderData } from 'utils/parse';
import { parseTokenStatisticsData } from 'utils/parse/TokenStatistics';
import {
  BITQUERY_PAIR_EXPLORER,
  BITQUERY_CONTRACT_ORDERS,
  BITQUERY_TOKEN_ORDERS,
  BITQUERY_MY_ORDERS,
  BITQUERY_MY_TRANSFERS,
  BITQUERY_MY_TOKEN_BALANCE,
  SEARCH,
  BITQUERY_MY_TOKEN_BALANCE_AT,
  BITQUERY_ORDERS_BY_TOKENS,
  BITQUERY_ORDERS_BY_PAIRS,
  BITQUERY_TOKEN_INFO,
  BITQUERY_TOKEN_STATISTICS
} from './gql';

export const client = new ApolloClient({
  uri: 'https://dexkit.graphql.bitquery.io',
  cache: new InMemoryCache(),
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT x.y; Win64; x64; rv:10.0) Gecko/20100101 Firefox/10.0',
    'Access-Control-Allow-Origin': '*.bitquery.io/*'
  }
});

export function getPairExplorer<T>(network: NETWORK, exchangeName: EXCHANGE, address: string, limit: number): Promise<ApolloQueryResult<T>>
{
  return client.query({
    query: BITQUERY_PAIR_EXPLORER,
    variables: {
      network,
      exchangeName,
      address,
      limit
    }
  });
}

export function getContractOrders(network: NETWORK, exchangeName: EXCHANGE, address: string, limit: number, offset: number, from: Date|null, till: Date|null): Promise<OrderData[]>
{
  return client.query({
    query: BITQUERY_CONTRACT_ORDERS,
    variables: {
      network,
      exchangeName,
      address,
      limit,
      offset,
      from: from ? from.toISOString() : null,
      till: till ? till.toISOString() : null
    }
  }).then(orders => {
    return parseOrderData(orders);
  }).catch(e => {
    return parseOrderData(null);
  });
}

export function getTokenOrders(network: NETWORK, exchangeName: EXCHANGE, address: string, limit: number, offset: number, from: Date|null, till: Date|null): Promise<OrderData[]>
{
  return client.query({
    query: BITQUERY_TOKEN_ORDERS,
    variables: {
      network,
      exchangeName,
      address,
      limit,
      offset,
      from: from ? from.toISOString() : null,
      till: till ? till.toISOString() : null
    }
  }).then(orders => {
    return parseOrderData(orders);
  }).catch(e => {
    console.log(e);
    return parseOrderData(null);
  });
}

export function getMyOrders(network: NETWORK, exchangeName: EXCHANGE, address: string, limit: number, offset: number, from: Date|null, till: Date|null): Promise<OrderData[]>
{
  return client.query({
    query: BITQUERY_MY_ORDERS,
    variables: {
      network,
      exchangeName,
      address,
      limit,
      offset,
      from: from ? from.toISOString() : null,
      till: till ? till.toISOString() : null
    }
  }).then(orders => {
    return parseOrderData(orders);
  }).catch(e => {
    return parseOrderData(null);
  });
}

// ok - melhorar nome da função
export function getOrdersByPairs(network: NETWORK, exchangeName: EXCHANGE, limit: number, offset: number, from: Date|null, till: Date|null): Promise<OrderByPairs[]>
{
  return client.query({
    query: BITQUERY_ORDERS_BY_PAIRS,
    variables: {
      network,
      exchangeName,
      limit,
      offset,
      from: from ? from.toISOString() : null,
      till: till ? till.toISOString() : null
    }
  }).then(orders => {
    return parseOrderByPairData(orders);
  }).catch(e => {
    return parseOrderByPairData(null);
  });  
}

// ok - melhorar nome da função
export function getOrdersByTokens(network: NETWORK, exchangeName: EXCHANGE, limit: number, offset: number, from: Date|null, till: Date|null): Promise<OrderByToken[]>
{
  return client.query({
    query: BITQUERY_ORDERS_BY_TOKENS,
    variables: {
      network,
      exchangeName,
      limit,
      offset,
      from: from ? from.toISOString() : null,
      till: till ? till.toISOString() : null
    }
  }).then(orders => {
    return parseOrderByTokenData(orders);
  }).catch(e => {
    return parseOrderByTokenData(null);
  });  
}

export function getMyTransfers<T>(network: NETWORK, address: string, limit: number, offset: number, from: Date, till: Date): Promise<ApolloQueryResult<T>>
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
  });
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

// ok
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

// ok
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

//ok
export function search<T>(/*network: NETWORK, */value: string): Promise<ApolloQueryResult<T>>
{
  return client.query<T>({
    query: SEARCH,
    variables: {
      /*network,*/
      value
    }
  });
}