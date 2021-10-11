import { BigNumber } from "ethers";
import { ChainId } from "types/blockchain";

export const METADATA_KITTY_ENDPOINT = 'https://mumbai-kittygotchi.dexkit.com/api/'

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
    [ChainId.Matic]: '',
    [ChainId.Mumbai]: '0xd1dB3811011Ecfdf1a9518d984aBCa089e93Bc2b',
  };