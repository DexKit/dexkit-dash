import { WETH9Contract } from "@0x/contract-wrappers";
import { BigNumber } from "@0x/utils";
import { ChainId } from "types/blockchain";

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const UNLIMITED_ALLOWANCE_IN_BASE_UNITS = new BigNumber(2).pow(256).minus(1);

export const ZERO = new BigNumber(0);

export const GWEI_IN_WEI = new BigNumber(1000000000);

export const DEFAULT_GAS_PRICE = GWEI_IN_WEI.multipliedBy(6);

export const GET_DEFAULT_QUOTE = (chainId: ChainId|undefined) => {
  const id = Number(chainId);

  switch(id) {
    case ChainId.Mainnet:
    case ChainId.Rinkeby:
    case ChainId.Kovan:
    case ChainId.Goerli:
    case ChainId.Ropsten:
        return '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
    default:
      return null;
    
  }
}

export const GET_CHAIN_ID_NAME = (chainId: ChainId|undefined) => {
  const id = Number(chainId);

  switch (id) {
    case ChainId.Mainnet:
      return 'Mainnet';
    case ChainId.Kovan:
      return 'Kovan';
    case ChainId.Ropsten:
      return 'Ropsten';
    case ChainId.Binance:
      return 'BSC';
    case ChainId.BinanceTest:
      return 'BSC Test';
      return undefined;
  }
};