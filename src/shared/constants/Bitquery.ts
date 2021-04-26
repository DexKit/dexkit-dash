import { ChainId } from "types/blockchain";

export enum EXCHANGE {
  // ethereum
  UNISWAP = 'Uniswap',
  SUSHISWAP = 'SushiSwap',
  ZEROX = 'Zerox Exchange',
  CURVE = 'Curve',
  BALANCER = 'Balancer',
  BANCOR_NETWORK = 'Bancor Network',
  KYBER_NETWORK = 'Kyber Network',
  //bsc
  PANCAKE = 'Pancake',
  ALL = ''
}

export enum PROTOCOL {
  // ethereum
  UNISWAP_V2 = 'Uniswap v2',
  ZEROX_V3 = 'Zerox Exchange v3',
  BANCOR_V2 = 'Bancor Network v2',
  CURVE = 'Curve',
  BALANCER =  'Balancer Pool Token',
  DODO =  'DODO',
  //bsc
  PANCAKE = 'Pancake',
  ALL = ''
}


export enum NETWORK {
  ETHEREUM = 'ethereum',
  BSC = 'bsc',
  BSCTEST = 'bsc_testnet'
}

export const GET_NETWORK_NAME = (chainId: ChainId|undefined) => {
  switch (chainId) {
    case ChainId.Mainnet:
    case ChainId.Ropsten:
    case ChainId.Rinkeby:
    case ChainId.Kovan:
    case ChainId.Goerli: return NETWORK.ETHEREUM;
    case ChainId.Binance: return NETWORK.BSC;
    case ChainId.BinanceTest: return NETWORK.BSCTEST;
    default: return NETWORK.ETHEREUM;
  }
}

