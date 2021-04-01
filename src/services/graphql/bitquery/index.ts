import { ApolloClient, ApolloQueryResult, InMemoryCache } from '@apollo/client';
import { BITQUERY_PAIR_EXPLORER, BITQUERY_MY_TOKEN_BALANCE, SEARCH, BITQUERY_MY_TOKEN_BALANCE_AT } from './gql';

export const client = new ApolloClient({
  uri: 'https://dexkit.graphql.bitquery.io',
  cache: new InMemoryCache(),
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT x.y; Win64; x64; rv:10.0) Gecko/20100101 Firefox/10.0',
    'Access-Control-Allow-Origin': '*.bitquery.io/*'
  }
});

export function getPairExplorer<T>(address: string, exchangeName: string, limit: number): Promise<ApolloQueryResult<T>>
{
  return client
  .query({
    query: BITQUERY_PAIR_EXPLORER
  });
}

export function getMyTokenBalances<T>(network: string, address: string): Promise<ApolloQueryResult<T>>
{
  return client.query({
    query: BITQUERY_MY_TOKEN_BALANCE,
    variables: {network, address}
  });
}

export function getMyTokenBalancesAt<T>(network: string, address: string, date: Date): Promise<ApolloQueryResult<T>>
{
  return client.query({
    query: BITQUERY_MY_TOKEN_BALANCE_AT,
    variables: {network, address, date: date.toISOString()}
  });
}


export function search<T>(value: string): Promise<ApolloQueryResult<T>>
{
  return client.query<T>({
    query: SEARCH,
    variables: {value}
  });
}