import { ChainId } from 'types/blockchain';

export const NFT_LEAGUE_MULTIPLIERS = [1, 10, 100, 1000];

export const NFT_LEAGUE_SUPPORTED_NETWORKS = [ChainId.Matic, ChainId.Mumbai];

export const NFT_LEAGUE_FACTORY_ADDRESS = {
  [ChainId.Mumbai]: '0x31540461C134895d0f07a44241C9BD65a71926CF',
  [ChainId.Matic]: '0xefe160ADAe79Cc2D760CA495f3e7757F6Bc054Da',
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
    'Bitcoin',
    'Ethereum',
    'ChainLink',
    'Polkadot',
    'Uniswap',
    'Cardano',
    'Doge',
  ],
  [ChainId.Binance]: [],
  [ChainId.Matic]: [
    'Bitcoin',
    'Ethereum',
    'ChainLink',
    'Polkadot',
    'Uniswap',
    'Cardano',
    'Doge',
  ],
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
