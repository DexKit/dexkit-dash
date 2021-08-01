import {ChainId} from 'types/blockchain';
import {EthereumNetwork, MainnetNetwork, EXCHANGE} from './AppEnums';

export const GET_NETWORK_NAME = (chainId?: ChainId) => {
  switch (Number(chainId)) {
    case ChainId.Mainnet:
    case ChainId.Ropsten:
    case ChainId.Rinkeby:
    case ChainId.Kovan:
    case ChainId.Goerli:
      return EthereumNetwork.ethereum;
    case ChainId.Binance:
      return EthereumNetwork.bsc;
    case ChainId.BinanceTest:
      return EthereumNetwork.bsc_testnet;
    default:
      return EthereumNetwork.ethereum;
  }
};

export const GET_NATIVE_COIN_FROM_NETWORK_NAME = (
  networkName: EthereumNetwork,
) => {
  switch (networkName) {
    case EthereumNetwork.ethereum:
      return 'eth';
    case EthereumNetwork.bsc:
      return 'bnb';
    default:
      return 'eth';
  }
};

export const FORMAT_NETWORK_NAME = (
  networkName: EthereumNetwork | MainnetNetwork,
) => {
  switch (networkName) {
    case EthereumNetwork.ethereum:
      return 'ETH';
    case EthereumNetwork.bsc:
      return 'BSC';
    case MainnetNetwork.btc:
      return 'BTC';
    case MainnetNetwork.dogecoin:
      return 'DOGE';
    default:
      return 'ETH';
  }
};

export const GET_WRAPPED_NATIVE_COIN_FROM_NETWORK_NAME = (
  networkName: EthereumNetwork,
) => {
  switch (networkName) {
    case EthereumNetwork.ethereum:
      return 'weth';
    case EthereumNetwork.bsc:
      return 'wbnb';
    default:
      return 'weth';
  }
};

export const GET_EXCHANGE_NAME = (exchange: EXCHANGE) => {
  switch (exchange) {
    case EXCHANGE.UNISWAP:
      return 'Uniswap';
    case EXCHANGE.ZEROX:
      return 'Zerox Exchange';
    case EXCHANGE.BALANCER:
      return 'Balancer';
    case EXCHANGE.SUSHISWAP:
      return 'SushiSwap';
    case EXCHANGE.PANCAKE:
      return 'Pancake';
    case EXCHANGE.PANCAKEV2:
      return 'Pancake v2';
    default:
      return '';
  }
};
