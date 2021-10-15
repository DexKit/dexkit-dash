import {BigNumber} from 'ethers';
import {ChainId} from 'types/blockchain';

export const METADATA_KITTY_ENDPOINT =
  'https://mumbai-kittygotchi.dexkit.com/api/';

export const GAS_PRICE_MULTIPLIER = 2;

export const PRICE = {
  // 10 Matic
  [ChainId.Matic]: BigNumber.from(10).mul(BigNumber.from(10).pow(18)),
  [ChainId.Mumbai]: BigNumber.from(100),
};

export const GET_KITTY_CHAIN_ID = (chainId?: ChainId) => {
  if (chainId && chainId === ChainId.Mumbai) {
    return ChainId.Mumbai;
  }
  return ChainId.Matic;
};

export const KITTYGOTCHI = {
  [ChainId.Matic]: '0xEA88540adb1664999524d1a698cb84F6C922D2A1',
  [ChainId.Mumbai]: '0xbdd0C521aBb19fA863917e2C807f327957D239ff',
};
