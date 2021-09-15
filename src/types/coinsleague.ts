import {BigNumber} from 'ethers';

export interface Player {
  score: BigNumber;
  player_address: string;
  coin_feeds?: CoinFeed[];
}

export interface CoinFeed {
  address: string;
  start_price: BigNumber;
  end_price: BigNumber;
  score: BigNumber;
}

export interface Game {
  players: Player[];
  coinFeeds?: CoinFeed[];
  started: boolean;
  finished: boolean;
  aborted: boolean;
  scores_done: boolean;
  duration: BigNumber;
  num_players: number;
  amount_to_play: BigNumber;
  total_amount_collected: BigNumber;
  num_coins: number;
  start_timestamp: BigNumber;
  abort_timestamp: BigNumber;
  address: string;
}

export interface GameParams {
  numPlayers: number;
  duration: number;
  amountUnit: BigNumber;
  numCoins: number;
  abortTimestamp: number;
}
