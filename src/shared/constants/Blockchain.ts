import {BigNumber} from '@0x/utils';
import {ChainId} from 'types/blockchain';
import {EthereumNetwork} from './AppEnums';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const STAKING_POOL =
  process.env.REACT_APP_DEXKIT_POOL ||
  '0x0000000000000000000000000000000000000000000000000000000000000010';

export const FEE_RECIPIENT =
  process.env.REACT_APP_FEE_RECIPIENT || ZERO_ADDRESS;

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
    default:
      return null;
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
    default:
      return null;
  }
};

export const GET_DEFAULT_TOKEN_NETTOWRK = (chainId: ChainId | undefined) => {
  const id = Number(chainId);

  switch (id) {
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

export const GET_CHAIN_ID_NAME = (chainId: ChainId | undefined) => {
  const id = Number(chainId);

  switch (id) {
    case ChainId.Mainnet:
      return 'ETH';
    case ChainId.Matic:
      return 'MATIC';
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

export const GET_CHAIN_FROM_NETWORK = (network: EthereumNetwork) => {
  switch (network) {
    case EthereumNetwork.ethereum:
      return ChainId.Mainnet;
    case EthereumNetwork.bsc:
      return ChainId.Binance;
    default:
      return ChainId.Mainnet;
  }
};
