import { ChainId } from 'types/blockchain';

export const NFT_LEAGUE_MULTIPLIERS = [1, 10, 100, 1000];

export const NFT_LEAGUE_FACTORY_ADDRESS = {
  [ChainId.Mumbai]: '0x31540461C134895d0f07a44241C9BD65a71926CF',
  [ChainId.Matic]: '',
  [ChainId.Binance]: '',
};

export function GET_NFT_LEAGUE_FACTORY_ADDRESS(chainId?: ChainId) {
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
