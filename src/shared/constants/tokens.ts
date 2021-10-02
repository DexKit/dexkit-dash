import {ChainId} from 'types/blockchain';
import {Token} from 'types/app';
import { EthereumNetwork } from './AppEnums';

const WETH: Token = {
  address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  chainId: ChainId.Mainnet,
  name: 'Wrapped ETH',
  symbol: 'WETH',
  decimals: 18,
  logoURI: '',
};

const DEXKIT_ETH: Token = {
  address: '0x7866E48C74CbFB8183cd1a929cd9b95a7a5CB4F4',
  chainId: ChainId.Mainnet,
  name: 'DexKit',
  symbol: 'KIT',
  decimals: 18,
  logoURI: '',
};

const DEXKIT_MATIC: Token = {
  address: '0x4d0def42cf57d6f27cd4983042a55dce1c9f853c',
  chainId: ChainId.Matic,
  name: 'DexKit',
  symbol: 'KIT',
  decimals: 18,
  logoURI: '',
};

const BITTOKEN_MATIC: Token = {
  address: '0xfd0cbdDec28a93bB86B9db4A62258F5EF25fEfdE',
  chainId: ChainId.Matic,
  name: 'BITTOKEN',
  symbol: 'BITT',
  decimals: 18,
  logoURI: '',
};

const BITTOKEN_ETH: Token = {
  address: '0x9F9913853f749b3fE6D6D4e16a1Cc3C1656B6D51',
  chainId: ChainId.Mainnet,
  name: 'BITTOKEN',
  symbol: 'BITT',
  decimals: 18,
  logoURI: '',
};

// a list of tokens by chain
type DexKitTokenList = {
  readonly [chainId in ChainId]: Token;
};



/*const WETH_ONLY: ChainTokenList = {
    [ChainId.Mainnet]: [WETH],

}*/

export const DEXKIT: Partial<DexKitTokenList> = {
  [ChainId.Mainnet]: DEXKIT_ETH,
  [ChainId.Matic]: DEXKIT_MATIC,
};

export const BITTOKEN: Partial<DexKitTokenList> = {
  [ChainId.Mainnet]: BITTOKEN_ETH,
  [ChainId.Matic]: BITTOKEN_MATIC,
};


// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[];
};

const ROPSTEN_LIST: Token[] = [
  {
    address: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
    chainId: ChainId.Ropsten,
    networkName: EthereumNetwork.ethereum,
    name: 'Wrapped Ether',
    symbol: 'WETH',
    decimals: 18,
    logoURI: '/images/coins/Weth.png',
  },
  {
    address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    chainId: ChainId.Ropsten,
    networkName: EthereumNetwork.ethereum,
    name: 'Uniswap',
    symbol: 'Uni',
    decimals: 18,
    logoURI: 'https://cloudflare-ipfs.com/ipfs/QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg/',
  },
  {
    address: '0xaD6D458402F60fD3Bd25163575031ACDce07538D',
    chainId: ChainId.Ropsten,
    networkName: EthereumNetwork.ethereum,
    name: 'Dai',
    symbol: 'DAI',
    decimals: 18,
    logoURI: '/images/coins/DAI.png',
  }
]


const BSC_TESTNET_LIST: Token[] = [
  {
    address: '0xaE8E19eFB41e7b96815649A6a60785e1fbA84C1e',
    chainId: ChainId.BinanceTest,
    name: 'Wrapped BNB',
    symbol: 'WBNB',
    decimals: 18,
    logoURI: '',
  },
  {
    address: '0x404460c6a5ede2d891e8297795264fde62adbb75',
    chainId: ChainId.BinanceTest,
    name: 'ChainLink Token',
    symbol: 'LINK',
    decimals: 18,
    logoURI: '',
  },
]

const MUMBAI_TESTNET_LIST: Token[] = [
  /*{
    address: '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
    chainId: ChainId.Mumbai,
    name: 'ChainLink Token',
    symbol: 'LINK',
    decimals: 18,
    logoURI: '',
  },*/
]

export const TOKENS_LIST: Partial<ChainTokenList> = {
  [ChainId.Ropsten]: ROPSTEN_LIST,
  [ChainId.Mumbai]: MUMBAI_TESTNET_LIST,
  [ChainId.BinanceTest]: BSC_TESTNET_LIST,
};
