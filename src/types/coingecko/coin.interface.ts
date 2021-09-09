import {MarketData} from './marketData.interface';
import {TickerCoingGecko} from './ticker.interface';

export interface CoinDetailCoinGecko {
  id: string;
  symbol: string;
  name: string;
  asset_platform_id: string;
  block_time_in_minutes: number;
  hashing_algorithm?: string;
  categories: string[];
  public_notice?: string;
  additional_notices: string[];
  url: string;
  localization: {[key: string]: string};
  description: {[key: string]: string};
  trade_volume_24h_btc: number;
  platforms?: {
    ethereum?: string;
    'binance-smart-chain'?: string;
    'polygon-pos'?: string;
  };
  links: {
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
    chat_url: string[];
    announcement_url: string[];
    twitter_screen_name: string;
    facebook_username: string;
    bitcointalk_thread_identifier: number;
    telegram_channel_identifier: string;
    subreddit_url: string | null;
    repos_url: {
      github: string[];
      bitbucket: string[];
    };
  };
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  country_origin: string;
  genesis_date?: string;
  contract_address: string;
  sentiment_votes_up_percentage: number;
  sentiment_votes_down_percentage: number;
  market_cap_rank: number;
  coingecko_rank: number;
  coingecko_score: number;
  developer_score: number;
  community_score: number;
  liquidity_score: number;
  public_interest_score: number;
  market_data: MarketData;
  community_data: {
    facebook_likes: number;
    twitter_followers: number;
    reddit_average_posts_48h: number;
    reddit_average_comments_48h: number;
    reddit_subscribers: number;
    reddit_accounts_active_48h: number;
    telegram_channel_user_count: number;
  };
  developer_data: {
    forks: number;
    stars: number;
    subscribers: number;
    total_issues: number;
    closed_issues: number;
    pull_requests_merged: number;
    pull_request_contributors: number;
    commit_count_4_weeks: number;
    last_4_weeks_commit_activity_series: any[];
  };
  public_interest_stats: {
    alexa_rank: number;
    bing_matches: number;
  };
  status_updates: [];
  last_updated: Date;
  tickers: TickerCoingGecko[];
  sparkline?: any[];
}

export interface CoinItemCoinGecko {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: null;
  max_supply: null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: ROI | null;
  last_updated: string;
  sparkline_in_7d?: {
    price: number[];
  };
}

interface ROI {
  times: number;
  currency: string;
  percentage: number;
}
