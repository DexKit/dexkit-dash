export interface MarketData {
      current_price: { [key: string]: number };
      roi: any;
      ath: { [key: string]: number };
      ath_change_percentage: { [key: string]: number };
      ath_date: { [key: string]: Date };
      atl: { [key: string]: number };
      atl_change_percentage: { [key: string]: number };
      atl_date: { [key: string]: Date };
      market_cap: { [key: string]: number };
      market_cap_rank: number;
      fully_diluted_valuation: any;
      total_volume: { [key: string]: number };
      high_24h: { [key: string]: number };
      low_24h: { [key: string]: number };
      price_change_24h: number;
      price_change_percentage_24h: number
      price_change_percentage_7d: number;
      price_change_percentage_14d:number;
      price_change_percentage_30d: number;
      price_change_percentage_60d: number;
      price_change_percentage_200d: number;
      price_change_percentage_1y: number;
      market_cap_change_24h: number;
      market_cap_change_percentage_24h: number;
      price_change_24h_in_currency: { [key: string]: number };
      price_change_percentage_1h_in_currency: { [key: string]: number };
      price_change_percentage_24h_in_currency: { [key: string]: number };
      price_change_percentage_7d_in_currency: { [key: string]: number };
      price_change_percentage_14d_in_currency: { [key: string]: number };
      price_change_percentage_30d_in_currency: { [key: string]: number };
      price_change_percentage_60d_in_currency: { [key: string]: number };
      price_change_percentage_200d_in_currency: { [key: string]: number };
      price_change_percentage_1y_in_currency: { [key: string]: number };
      market_cap_change_24h_in_currency: { [key: string]: number };
      market_cap_change_percentage_24h_in_currency: { [key: string]: number };
      total_supply: number;
      max_supply?: number;
      circulating_supply: number;
      last_updated: Date;
      sparkline_7d?: {
        price: number[]
      }
}