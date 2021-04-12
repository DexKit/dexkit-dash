import { ChainId } from "types/blockchain";

export enum EXCHANGE {
  UNISWAP = 'Uniswap'
}

export enum NETWORK {
  ETHEREUM = 'ethereum',
  BSC = 'bsc',
  BSCTEST = 'bsc_testnet',
  ALL = ''
}

export const GET_NETWORK_NAME = (chainId: ChainId|undefined) => {
  switch (chainId) {
    case ChainId.Mainnet:
    case ChainId.Ropsten:
    case ChainId.Rinkeby:
    case ChainId.Kovan:
    case ChainId.Goerli:
      return NETWORK.ETHEREUM;
    case ChainId.Binance:
      return NETWORK.BSC;
    case ChainId.BinanceTest:
      return NETWORK.BSCTEST;
    default:
      return NETWORK.ALL;
  }
}