import {ChainId} from 'types/blockchain';

export const NFT_LEAGUE_MULTIPLIERS = [1, 10, 100, 1000];

export const NFT_LEAGUE_FACTORY_ADDRESS = {
  [ChainId.Mumbai]: '0x5cb29ddF98D3d9Ea17ecF4861Ec50980f1d020C0',
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
