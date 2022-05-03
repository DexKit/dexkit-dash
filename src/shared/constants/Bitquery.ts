import { ChainId } from 'types/blockchain';
import { EthereumNetwork, MainnetNetwork, EXCHANGE } from './AppEnums';

export const GET_NETWORK_NAME = (chainId?: ChainId) => {
  switch (Number(chainId)) {
    case ChainId.Mainnet:
    case ChainId.Ropsten:
    case ChainId.Rinkeby:
    case ChainId.Kovan:
    case ChainId.Goerli:
      return EthereumNetwork.ethereum;
    case ChainId.Mumbai:
    case ChainId.Matic:
      return EthereumNetwork.matic;
    case ChainId.Binance:
      return EthereumNetwork.bsc;
    case ChainId.BinanceTest:
      return EthereumNetwork.bsc_testnet;
    case ChainId.Fantom:
      return EthereumNetwork.fantom;
    case ChainId.Avalanche:
      return EthereumNetwork.avalanche;
    default:
      return EthereumNetwork.ethereum;
  }
};

export const GET_NETWORK_NAME_V2 = (networkName: string, chainId?: ChainId,) => {
  switch (Number(chainId)) {
    case ChainId.Mainnet:
    case ChainId.Ropsten:
    case ChainId.Rinkeby:
    case ChainId.Kovan:
    case ChainId.Goerli:
      return EthereumNetwork.ethereum;
    case ChainId.Mumbai:
    case ChainId.Matic:
      return EthereumNetwork.matic;
    case ChainId.Binance:
      return EthereumNetwork.bsc;
    case ChainId.BinanceTest:
      return EthereumNetwork.bsc_testnet;
    default:
      return networkName;
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
    case EthereumNetwork.matic:
      return 'matic';
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
    case EthereumNetwork.matic:
      return 'MATIC';
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
    case EthereumNetwork.matic:
      return 'wmatic';
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

export enum Network {
  algorand = 'algorand',
  algorand_betanet = 'algorand_betanet',
  algorand_testnet = 'algorand_testnet',
  binance = 'binance',
  bitcash = 'bitcash',
  bitcoin = 'bitcoin',
  bitcoinsv = 'bitcoinsv',
  bsc = 'bsc',
  bsc_testnet = 'bsc_testnet',
  cardano = 'cardano',
  celo_alfajores = 'celo_alfajores',
  celo_baklava = 'celo_baklava',
  celo_rc1 = 'celo_rc1',
  conflux_oceanus = 'conflux_oceanus',
  conflux_tethys = 'conflux_tethys',
  dash = 'dash',
  diem_testnet = 'diem_testnet',
  dogecoin = 'dogecoin',
  eos = 'eos',
  eth2 = 'eth2',
  ethclassic = 'ethclassic',
  ethclassic_reorg = 'ethclassic_reorg',
  ethereum = 'ethereum',
  filecoin = 'filecoin',
  goerli = 'goerli',
  hedera = 'hedera',
  libra_testnet = 'libra_testnet',
  litecoin = 'litecoin',
  medalla = 'medalla',
  tron = 'tron',
  zcash = 'zcash',
}

export const getNetworkName = (chainId?: ChainId) => {
  switch (Number(chainId)) {
    case ChainId.Mainnet:
      return 'Ethereum';
    case ChainId.Ropsten:
      return 'Ropsten';
    case ChainId.Rinkeby:
      return 'Rinkeby';
    case ChainId.Kovan:
      return 'Kovan';
    case ChainId.Goerli:
      return 'Goerli';
    case ChainId.Mumbai:
      return 'Mumbai';
    case ChainId.Matic:
      return 'Polygon';
    case ChainId.Binance:
      return 'Binance Smart Chain';
    case ChainId.BinanceTest:
      return 'Binance Testnet';
    default:
      return '';
  }
};
