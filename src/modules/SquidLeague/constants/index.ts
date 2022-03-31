import { ChainId } from 'types/blockchain';

export const SQUID_LEAGUE_FACTORY_ADDRESS = {
  [ChainId.Mumbai]: '0xA8fc32F15e646c0462d0D7Aabf87704daa166F80',
  [ChainId.Matic]: '0xa288E0cc2ed174bF8Eb8adb6CcD436FaceBEF472',
  [ChainId.Binance]: '',
};

export const GET_MAX_ROUNDS = (chainId?: ChainId) => {
  if (chainId === ChainId.Mumbai) {
    return 2;
  } else {
    return 6;
  }
}