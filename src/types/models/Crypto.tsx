import {PaletteColorOptions} from '@material-ui/core';

export interface CryptoGraphData {
  yearlyData: {month: string; amount: number}[];
  monthlyData: {date: string; amount: number}[];
  weeklyData: {day: string; amount: number}[];
  dailyData: {time: string; amount: number}[];
}

export interface CoinGraphData {
  bitcoin: {
    yearlyData: {month: string; amount: number}[];
    monthlyData: {date: string; amount: number}[];
    weeklyData: {day: string; amount: number}[];
    dailyData: {time: string; amount: number}[];
  };
  litecoin: {
    yearlyData: {month: string; amount: number}[];
    monthlyData: {date: string; amount: number}[];
    weeklyData: {day: string; amount: number}[];
    dailyData: {time: string; amount: number}[];
  };
  ripple: {
    yearlyData: {month: string; amount: number}[];
    monthlyData: {date: string; amount: number}[];
    weeklyData: {day: string; amount: number}[];
    dailyData: {time: string; amount: number}[];
  };
}

export interface BuySellDataProps {
  value: string;
  price: string;
  amount: string;
}

export interface BuySellProps {
  address?: string;
  buyData: BuySellDataProps;
  sellData: BuySellDataProps;
}

export interface CoinData {
  symbol?: string;
  name: string;
  price: string;
  increment: number;
  image?: string;
}

export interface CoinsDataProps {
  bitcoin: CoinData;
  etherium: CoinData;
  liteCoin: CoinData;
  ripple: CoinData;
}

export interface MarketGraphData {
  month: string;
  medium: number;
  low: number;
  high: number;
  amt: number;
}

export interface NewsData {
  id: number;
  news: string;
  created: string;
  image: string;
  by: string;
}

export interface PopularCoinsData {
  id: number;
  name: string;
  shortName: string;
  marketCap: string;
  volume: string;
  h: string;
  image: string;
  color: PaletteColorOptions;
}

export interface NewPopularCoinsData {
  id: number;
  name: string;
  shortName: string;
  volume: string;
  image: string;
  color: PaletteColorOptions;
}

export interface BalanceCoins {
  id: number;
  name: string;
  symbol?: string;
  value: number | string;
  usd?: number;
}

export interface TotalBalanceData {
  balance: string;
  coins: BalanceCoins[];
}

export interface BtcChartData {
  id: number;
  name: string;
  value: number;
  color: string;
}

export interface Crypto {
  coinGraphData: CoinGraphData;
  buySell: BuySellProps;
  coinsData: CoinsDataProps;
  marketGraphData: MarketGraphData[];
  newsData: NewsData[];
  popularCoins: PopularCoinsData[];
  totalBalanceData: TotalBalanceData;
  btcChartData: BtcChartData[];
}
