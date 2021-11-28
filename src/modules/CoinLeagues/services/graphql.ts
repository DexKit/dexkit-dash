import {ApolloClient, InMemoryCache} from '@apollo/client';

export const client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/joaocampos89/coinleaguesv2',
  cache: new InMemoryCache(),
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT x.y; Win64; x64; rv:10.0) Gecko/20100101 Firefox/10.0',
  },
});


export const nftClient = new ApolloClient({
  uri: 'https://thegraph.com/hosted-service/subgraph/joaocampos89/coinleagues-nftroom',
  cache: new InMemoryCache(),
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT x.y; Win64; x64; rv:10.0) Gecko/20100101 Firefox/10.0',
  },
});
