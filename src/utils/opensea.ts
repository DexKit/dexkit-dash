import {Network, OpenSeaPort} from 'opensea-js';

// FIXME: use another source
export const RINKEBY_NETWORK = 0x4;

const RINKEBY_API_CONFIG = {
  apiBaseUrl: 'https://rinkeby-api.opensea.io',
  networkName: Network.Rinkeby,
  apiKey: process.env.REACT_APP_OPENSEA_API_KEY,
};

export async function getChainId(provider: any) {
  if (provider) {
    return provider.request({method: 'eth_chainId'});
  }
  return null;
}

export async function getOpenSeaPort(provider: any) {
  let config = {
    apiBaseUrl: 'https://api.opensea.io',
    networkName: Network.Main,
    apiKey: process.env.REACT_APP_OPENSEA_API_KEY,
  };

  const chainId = await getChainId(provider);

  if (chainId === RINKEBY_NETWORK) {
    config = RINKEBY_API_CONFIG;
  }

  const port = new OpenSeaPort(provider, config);

  return port;
}
