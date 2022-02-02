import {ChainId} from 'types/blockchain';

export const ExplorerURL = {
  [ChainId.Mumbai]: 'https://mumbai.polygonscan.com/tx/',
  [ChainId.Matic]: 'https://polygonscan.com/tx/',
  [ChainId.Binance]: 'https://bscan.com/tx/',
};

export const GET_LEAGUES_CHAIN_ID = (chainId?: ChainId) => {
  if (chainId && chainId === ChainId.Mumbai) {
    return ChainId.Mumbai;
  }
  if (chainId && chainId === ChainId.Binance) {
    return ChainId.Binance;
  }
  return ChainId.Matic;
};

export const IS_SUPPORTED_LEAGUES_CHAIN_ID = (chainId?: ChainId) => {
  if (chainId === ChainId.Mumbai || chainId === ChainId.Matic || chainId === ChainId.Binance) {
    return true;
  }
  return false;
};

