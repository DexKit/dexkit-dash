export * from './coin.interface';
export * from './exchanges.interface';

export interface CoinListItemCoingecko {
  id: string;
  symbol: string;
  name: string;
  platforms: {
    ethereum: string | null;
    'binance-smart-chain': string | null;
    'polygon-pos': string | null;
  };
}
