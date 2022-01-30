import {Network, OpenSeaPort} from 'opensea-js';
import {ChainId} from 'types/blockchain';

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

const KLAYTN_CHAIN_ID = 8217;

export function isOpenSeaSupported(chainId: number) {
  return (
    chainId === ChainId.Mainnet ||
    chainId === ChainId.Matic ||
    chainId === KLAYTN_CHAIN_ID
  );
}

export function getOpenSeaLink(
  chainId?: number,
  contractAddress?: string,
  tokenId?: string,
) {
  if (chainId === ChainId.Mainnet) {
    return `https://opensea.io/assets/${contractAddress}/${tokenId}`;
  } else if (chainId === ChainId.Matic) {
    return `https://opensea.io/assets/matic/${contractAddress}/${tokenId}`;
  } else if (chainId === KLAYTN_CHAIN_ID) {
    return `https://opensea.io/assets/klaytn/${contractAddress}/${tokenId}`;
  } else if (chainId === ChainId.Mumbai) {
    return `https://testnets.opensea.io/assets/mumbai/${contractAddress}/${tokenId}`;
  }

  return '';
}
