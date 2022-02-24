import {ChainId} from 'types/blockchain';

export const NFT_LEAGUE_MULTIPLIERS = [1, 10, 100, 1000];

export const NFT_LEAGUE_FACTORY_ADDRESS = {
  [ChainId.Mumbai]: '0x9565C656f26C55a18af32dab3bE8aaff1B0BbB72',
  [ChainId.Matic]: '',
  [ChainId.Binance]: '',
};

export function GET_NFT_LEAGUE_FACTORY_ADDRESS(chainId: ChainId) {
  if (
    chainId === ChainId.Mumbai ||
    chainId === ChainId.Matic ||
    chainId === ChainId.Binance
  ) {
    return NFT_LEAGUE_FACTORY_ADDRESS[chainId];
  }

  return '';
}

export const CHAMPIONS_COINS = {
  [ChainId.Mumbai]: [
    'Bittoken',
    'Bitcoin',
    'Ethereum',
    'ChainLink',
    'Polkadot',
    'Uniswap',
    'Cardano',
    'Doge',
  ],
  [ChainId.Binance]: [],
  [ChainId.Matic]: [],
};

export function GET_CHAMPIONS_COINS(chainId: ChainId) {
  if (
    chainId === ChainId.Mumbai ||
    chainId === ChainId.Matic ||
    chainId === ChainId.Binance
  ) {
    return CHAMPIONS_COINS[chainId];
  }

  return [];
}
