import {ChainId} from 'types/blockchain';
import { EthereumNetwork } from './AppEnums';
type Collection = {
  name: string;
  address: string;
  chainId: ChainId;
  symbol: string;
  logoURI?: string;
};

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Collection[];
};

const COLLECTION_MATIC = [
  {
    name: 'Chicken Derby',
    address: '0x8634666ba15ada4bbc83b9dbf285f73d9e46e4c2',
    chainId: ChainId.Matic,
    symbol: 'CHICKS',
    logoURI:
      'https://lh3.googleusercontent.com/z0605wLEPoraBKL4y4b3Be_yF9uKA_dO8Z24mNGhpXht_H0quGAFuzsBAOinZc8GQhI2NDQUfcpCfGQagttD-O2FogcKCsAy3pwFcd4=s130',
  },
];

const COLLECTION_MUMBAI = [
  {
    name: 'CoinLeaguesChampions',
    address: '0xe079d901807Baa2F94F4723E4A53fC2Ec41E3D5a',
    chainId: ChainId.Mumbai,
    symbol: 'CHAMPIONS',
  },
];

export const COLLECTION_LIST: Partial<ChainTokenList> = {
  [ChainId.Matic]: COLLECTION_MATIC,
  [ChainId.Mumbai]: COLLECTION_MUMBAI,
};

export const GET_CHAIN_FROM_NETWORK_FOR_COLLECTIONS = (network: EthereumNetwork, chainId?: ChainId) => {
    // used for tests
    if(chainId && chainId === ChainId.Mumbai){
        return chainId;
    }

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