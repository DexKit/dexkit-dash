import axios from 'axios';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {Token} from 'types/app';

const ethereumTokens = axios.create({
  baseURL: 'https://tokens.coingecko.com',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

const binanceTokens = axios.create({
  baseURL: 'https://raw.githubusercontent.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

const maticTokens = axios.create({
  baseURL: 'https://raw.githubusercontent.com',
  headers: {
    'Content-Type': 'application/json',
  },
});


let cacheEthTokens: Token[];
export async function getEthereumTokens(): Promise<Token[]> {
  if (cacheEthTokens) {
    return Promise.resolve(cacheEthTokens);
  }
  try {
    const response = await ethereumTokens.get('/uniswap/all.json');
    const tokens = response.data.tokens.map((t: any) => {
      return {...t, networkName: EthereumNetwork.ethereum};
    });
    tokens.unshift({
      address: '',
      decimals: 18,
      name: 'Ethereum',
      symbol: 'ETH',
      networkName: EthereumNetwork.ethereum,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
    });

    cacheEthTokens = tokens;
    return Promise.resolve(tokens);
  } catch (e) {
    return Promise.reject(e);
  }
}
let cacheBscTokens: Token[];
export async function getBinanceTokens(): Promise<Token[]> {
  if (cacheBscTokens) {
    return Promise.resolve(cacheBscTokens);
  }
  try {
    const response = await binanceTokens.get(
      '/pancakeswap/pancake-swap-interface-v1/master/src/constants/token/pancakeswap.json',
    );
    const tokens = response.data.tokens.map((t: any) => {
      return {...t, networkName: EthereumNetwork.bsc};
    });
    tokens.unshift({
      address: '',
      decimals: 18,
      name: 'Binance',
      symbol: 'BNB',
      networkName: EthereumNetwork.bsc,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png',
    });
    tokens.unshift({
      address: '0x314593fa9a2fa16432913dbccc96104541d32d11',
      decimals: 18,
      name: 'DexKit',
      symbol: 'KIT',
      networkName: EthereumNetwork.bsc,
      logoURI: '/assets/images/dexkit-logo.png',
    });
    cacheBscTokens = tokens;
    return Promise.resolve(tokens);
  } catch (e) {
    return Promise.reject(e);
  }
}
let cacheMaticTokens: Token[];

export async function getMaticTokens(): Promise<Token[]> {
  if (cacheMaticTokens) {
    return Promise.resolve(cacheMaticTokens);
  }
  try {
    const response = await maticTokens.get(
      '/BlockTimeWorld/SwapMatic/master/swapmatic.tokenlist.json',
    );
    const tokens = response.data.tokens.map((t: any) => {
      return {...t, networkName: EthereumNetwork.matic};
    });
    tokens.unshift({
      address: '',
      decimals: 18,
      name: 'Polygon',
      symbol: 'Matic',
      networkName: EthereumNetwork.matic,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png',
    });
    cacheMaticTokens = tokens;
    return Promise.resolve(tokens);
  } catch (e) {
    return Promise.reject(e);
  }
}
