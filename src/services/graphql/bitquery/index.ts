import { ApolloClient, ApolloQueryResult, InMemoryCache } from '@apollo/client';
import { BITQUERY_PAIR_EXPLORER } from './gql';

export const client = new ApolloClient({
  uri: 'https://graphql.bitquery.io',
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