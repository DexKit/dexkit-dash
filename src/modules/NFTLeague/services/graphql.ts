import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ChainId } from 'types/blockchain';

export const getGraphClient = (chainId?: ChainId) => {
  if (chainId === ChainId.Mumbai) {
    return mumbaiClient;
  }
  if (chainId === ChainId.Matic) {
    return maticClient;
  }
  return null;
};

export const mumbaiClient = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/joaocampos89/nft-league-mumbai',
  cache: new InMemoryCache(),
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT x.y; Win64; x64; rv:10.0) Gecko/20100101 Firefox/10.0',
  },
});

export const maticClient = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/joaocampos89/nft-league-matic',
  cache: new InMemoryCache(),
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT x.y; Win64; x64; rv:10.0) Gecko/20100101 Firefox/10.0',
  },
});

