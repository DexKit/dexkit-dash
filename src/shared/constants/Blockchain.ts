import { BigNumber } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ChainId } from 'types/blockchain';
import { EthereumNetwork } from './AppEnums';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const STAKING_POOL =
  process.env.REACT_APP_DEXKIT_POOL ||
  '0x0000000000000000000000000000000000000000000000000000000000000010';

export const FEE_RECIPIENT =
  process.env.REACT_APP_FEE_RECIPIENT || ZERO_ADDRESS;

export const FEE_PERCENTAGE =
  process.env.REACT_APP_FEE_PERCENTAGE || ZERO_ADDRESS;

export const TAKER_FEE_PERCENTAGE: string =
  process.env.REACT_APP_TAKER_FEE_PERCENTAGE || '0';

export const UNLIMITED_ALLOWANCE_IN_BASE_UNITS = new BigNumber(2)
  .pow(256)
  .minus(1);

export const ZERO = new BigNumber(0);

export const GWEI_IN_WEI = new BigNumber(1000000000);

export const DEFAULT_GAS_PRICE = GWEI_IN_WEI.multipliedBy(6);

export const GET_DEFAULT_QUOTE = (chainId: ChainId | undefined) => {
  const id = Number(chainId);

  switch (id) {
    case ChainId.Mainnet:
    case ChainId.Rinkeby:
    case ChainId.Kovan:
    case ChainId.Goerli:
    case ChainId.Ropsten:
      return '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
    case ChainId.Binance:
      return '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c';
    case ChainId.Matic:
      return '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270';
    default:
      return null;
  }
};

// Handle special cases of ETH, MATIC and BSC
export const GET_ADDRESS_FOR_PROTOCOL = (
  address: string,
  networkName: EthereumNetwork,
) => {
  if (Web3Wrapper.isAddress(address)) {
    return address;
  } else {
    return (
      GET_DEFAULT_TOKEN_BY_NETWORK(networkName) ||
      '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
    );
  }
};

export const GET_DEFAULT_BASE = (chainId: ChainId | undefined) => {
  const id = Number(chainId);

  switch (id) {
    case ChainId.Mainnet:
    case ChainId.Rinkeby:
    case ChainId.Kovan:
    case ChainId.Goerli:
    case ChainId.Ropsten:
      return '0x7866E48C74CbFB8183cd1a929cd9b95a7a5CB4F4';
    case ChainId.Binance:
      return '0x314593fa9a2fa16432913dbccc96104541d32d11';
    case ChainId.Matic:
      return '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270';
    default:
      return null;
  }
};

export const GET_DEFAULT_TOKEN_NETWORK = (chainId: ChainId | undefined) => {
  const id = Number(chainId);

  switch (id) {
    case ChainId.Matic:
      return '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270';
    case ChainId.Binance:
      return '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
    case ChainId.Mainnet:
      return '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
    case ChainId.Rinkeby:
    case ChainId.Kovan:
    case ChainId.Goerli:
    case ChainId.Ropsten:
    default:
      return null;
  }
};

export const GET_DEFAULT_TOKEN_BY_NETWORK = (
  network: EthereumNetwork | undefined,
) => {
  switch (network) {
    case EthereumNetwork.bsc:
      return '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
    case EthereumNetwork.ethereum:
      return '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
    case EthereumNetwork.matic:
      return '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270';
    default:
      return null;
  }
};

export const GET_DEFAULT_USD_TOKEN_BY_NETWORK = (
  network: EthereumNetwork | undefined,
) => {
  switch (network) {
    case EthereumNetwork.bsc:
      return '0xe9e7cea3dedca5984780bafc599bd69add087d56';
    case EthereumNetwork.ethereum:
      return '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
    case EthereumNetwork.matic:
      return '0x2791bca1f2de4661ed88a30c99a7a9449aa84174';
  }
};

export const GET_CHAIN_ID_NAME = (chainId: ChainId | undefined) => {
  const id = Number(chainId);
  switch (id) {
    case ChainId.Mainnet:
      return 'ETH';
    case ChainId.Rinkeby:
      return 'Rinkeby';
    case ChainId.Matic:
      return 'Polygon';
    case ChainId.Mumbai:
      return 'Mumbai';
    case ChainId.Kovan:
      return 'Kovan';
    case ChainId.Ropsten:
      return 'Ropsten';
    case ChainId.Binance:
      return 'BSC';
    case ChainId.BinanceTest:
      return 'BSC Test';
    default:
      return undefined;
  }
};

export const GET_CHAIN_ID_NAME_V2 = (
  chainId: number,
  networks?: { chainId: number; name: string }[],
): string => {
  if (networks) {
    const index = networks.findIndex((n) => n.chainId === chainId);

    if (index > -1) {
      return networks[index].name;
    }
  }
  return GET_CHAIN_ID_NAME(chainId) || '';
};

export const GET_CHAIN_NATIVE_COIN = (chainId: ChainId | undefined) => {
  const id = Number(chainId);

  switch (id) {
    case ChainId.Mainnet:
      return 'ETH';
    case ChainId.Rinkeby:
      return 'ETH';
    case ChainId.Matic:
      return 'MATIC';
    case ChainId.Mumbai:
      return 'MATIC';
    case ChainId.Kovan:
      return 'ETH';
    case ChainId.Ropsten:
      return 'ETH';
    case ChainId.Binance:
      return 'BNB';
    case ChainId.BinanceTest:
      return 'BNB';
    default:
      return undefined;
  }
};

export const GET_CHAIN_NATIVE_COIN_V2 = (
  chainId: ChainId | undefined,
  networks?: { chainId: number; symbol: string }[],
) => {
  const symbol = GET_CHAIN_NATIVE_COIN(chainId);

  if (!symbol && networks) {
    const index = networks?.findIndex((n) => n.chainId === chainId);

    if (index > -1) {
      return networks[index].symbol;
    }
  }

  return symbol;
};

export const GET_CHAIN_FROM_NETWORK = (network: EthereumNetwork) => {
  switch (network) {
    case EthereumNetwork.ethereum:
      return ChainId.Mainnet;
    case EthereumNetwork.bsc:
      return ChainId.Binance;
    case EthereumNetwork.matic:
      return ChainId.Matic;
    default:
      return ChainId.Mainnet;
  }
};
