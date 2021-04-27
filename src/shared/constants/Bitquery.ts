import { ChainId } from "types/blockchain";
import { EXCHANGE, NETWORK } from "./AppEnums";

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

export const GET_EXCHANGE_NAME = (exchange: EXCHANGE) => {
  switch (exchange) {
    case EXCHANGE.UNISWAP: return 'Uniswap';
    case EXCHANGE.ZEROX: return 'Zerox Exchange';
    case EXCHANGE.PANCAKE: return 'Pancake';
    default: return '';
  }
}