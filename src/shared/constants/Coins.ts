import {Coin, Token} from 'types/app';
import {ChainId} from 'types/blockchain';
import {Network} from './Bitquery';

export const ETH_SYMBOL_URL =
  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png';
export const BINANCE_SYMBOL_URL =
  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png';

export const MATIC_SYMBOL_URL =
  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png';

export const COINS: Coin[] = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    decimals: 8,
    address: '',
    networkName: Network.bitcoin,
    changelly_support: true,
    changelly_id: 'btc',
    isCoin: true,
    coingecko_id: 'bitcoin',
  },
  {
    name: 'DogeCoin',
    symbol: 'Doge',
    decimals: 8,
    address: '',
    networkName: Network.dogecoin,
    changelly_support: true,
    changelly_id: 'doge',
    isCoin: true,
    coingecko_id: 'dogecoin',
  },
];

const ETH: Token = {
  name: 'Ether',
  symbol: 'ETH',
  decimals: 18,
  address: 'eth',
};

const BNB: Token = {
  name: 'Binance',
  symbol: 'BNB',
  decimals: 18,
  address: 'bnb',
};

const MATIC: Token = {
  name: 'Polygon',
  symbol: 'MATIC',
  decimals: 18,
  address: 'matic',
};

export const ETHEREUM_NATIVE_COINS_BY_CHAIN = {
  [ChainId.Mainnet]: ETH,
  [ChainId.Rinkeby]: ETH,
  [ChainId.Ropsten]: ETH,
  [ChainId.Kovan]: ETH,
  [ChainId.Goerli]: ETH,
  [ChainId.Ganache]: ETH,
  [ChainId.Binance]: BNB,
  [ChainId.BinanceTest]: BNB,
  [ChainId.Mumbai]: MATIC,
  [ChainId.Matic]: MATIC,
};
