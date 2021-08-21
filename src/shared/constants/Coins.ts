import {Coin} from 'types/app';
import {Network} from './Bitquery';

export const ETH_SYMBOL_URL =
  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png';
export const BINANCE_SYMBOL_URL =
  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png';

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
