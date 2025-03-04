export interface OpenSeaToken {
  id?: number;
  symbol: string;
  address: string;
  image_url: string;
  name: string;
  decimals: number;
  eth_price: string;
  usd_price: string;
}

export interface AssetsQuery {
  owner: string;
  offset: number;
  limit: number;
  sortBy: string;
  collection?: string;
}
