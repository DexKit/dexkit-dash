import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ChainId } from 'types/blockchain';

export const getGraphClient = (isNFTGame: boolean, chainId?: ChainId,) => {
  if (isNFTGame) {
    return nftClient
  }

  if (chainId === ChainId.Binance) {
    return bscClient;
  }
  if (chainId === ChainId.Mumbai) {
    return mumbaiClient;
  }
  return client;
}

export const GET_GRAPHQL_CLIEN_URL_MAIN_ROOM = {
  [ChainId.Matic]: 'https://api.thegraph.com/subgraphs/name/joaocampos89/coinleaguev3',
  [ChainId.Binance]: 'https://api.thegraph.com/subgraphs/name/joaocampos89/coinleaguebsc',
  [ChainId.Mumbai]: 'https://api.thegraph.com/subgraphs/name/joaocampos89/coinleaguemumbaiv3'
}


export const client = new ApolloClient({
  uri: GET_GRAPHQL_CLIEN_URL_MAIN_ROOM[ChainId.Matic],
  cache: new InMemoryCache(),
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT x.y; Win64; x64; rv:10.0) Gecko/20100101 Firefox/10.0',
  },
});

export const bscClient = new ApolloClient({
  uri: GET_GRAPHQL_CLIEN_URL_MAIN_ROOM[ChainId.Binance],
  cache: new InMemoryCache(),
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT x.y; Win64; x64; rv:10.0) Gecko/20100101 Firefox/10.0',
  },
});

export const mumbaiClient = new ApolloClient({
  uri: GET_GRAPHQL_CLIEN_URL_MAIN_ROOM[ChainId.Mumbai],
  cache: new InMemoryCache(),
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT x.y; Win64; x64; rv:10.0) Gecko/20100101 Firefox/10.0',
  },
});


export const nftClient = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/joaocampos89/coinleagues-nftroom',
  cache: new InMemoryCache(),
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT x.y; Win64; x64; rv:10.0) Gecko/20100101 Firefox/10.0',
  },
});
