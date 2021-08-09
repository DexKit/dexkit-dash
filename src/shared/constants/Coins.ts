import {Coin} from 'types/app';
import {Network} from '../../../__generated__/globalTypes';

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
