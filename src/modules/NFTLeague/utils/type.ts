import {BigNumber} from 'ethers';

export interface CreateAndJoinParams {
  championId: number;
  bittFeed: number;
  multiplier: number;
  startTimestamp: number;
  duration: number;
  entry: BigNumber;
  type: number;
}

export interface JoinGameParams {
  id: number;
  championId: number;
  bittFeed: number;
  multiplier: number;
  entry: BigNumber;
}

export enum GameType {
  Winner,
  Loser,
}

export interface Game {
  id: BigNumber;
  claimed: boolean;
  started: boolean;
  finished: boolean;
  aborted: boolean;
  withdrawed: boolean;
  player1: string;
  player2: string;
  entry: BigNumber;
  duration: BigNumber;
  start_timestamp: BigNumber;
  winner: string;
  game_type: GameType;
}

export interface Coin {
  // Struct
  coin_feed: string;
  champion_id: BigNumber;
  multiplier: BigNumber;
  start_price: BigNumber;
  end_price: BigNumber;
  score: BigNumber;
  champion_score: BigNumber;
}
