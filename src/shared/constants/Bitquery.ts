import { ChainId } from "types/blockchain";
import { EXCHANGE, NETWORK, EthereumNetwork } from "./AppEnums";




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

export const GET_BITQUERY_NETWORK_NAME = (chainId: ChainId|undefined): EthereumNetwork => {
  switch (chainId) {
    case ChainId.Mainnet:
    case ChainId.Ropsten:
    case ChainId.Rinkeby:
    case ChainId.Kovan:
    case ChainId.Goerli: return EthereumNetwork.ethereum;
    case ChainId.Binance: return EthereumNetwork.bsc;
    case ChainId.BinanceTest: return EthereumNetwork.bsc_testnet;
    default: return EthereumNetwork.ethereum;
  }
}

export const GET_EXCHANGE_NAME = (exchange: EXCHANGE) => {
  switch (exchange) {
    case EXCHANGE.UNISWAP: return 'Uniswap';
    case EXCHANGE.ZEROX: return 'Zerox Exchange';
    case EXCHANGE.BALANCER: return 'Balancer';
    case EXCHANGE.SUSHISWAP: return 'SushiSwap';
    case EXCHANGE.PANCAKE: return 'Pancake';
    default: return '';
  }
}
