import {BigNumber} from 'ethers';

export interface Player {
  score: BigNumber;
  player_address: string;
  captain_coin: string;
  champion_id: string;
  affiliate?: string;
  coin_feeds?: CoinFeed[];
}

export interface CoinFeed {
  address: string;
  start_price: BigNumber;
  end_price: BigNumber;
  score: BigNumber;
}

export enum GameType {
  Winner,
  Loser,
}

export interface Game {
  players: Player[];
  coinFeeds?: CoinFeed[];
  game_type: GameType;
  started: boolean;
  finished: boolean;
  aborted: boolean;
  scores_done: boolean;
  duration: BigNumber;
  id:  BigNumber;
  num_players: BigNumber;
  amount_to_play: BigNumber;
  total_amount_collected: BigNumber;
  num_coins: BigNumber;
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
  startTimestamp: number;
  type: number;
  championRoom?: number;
  isNFT: boolean;
}
