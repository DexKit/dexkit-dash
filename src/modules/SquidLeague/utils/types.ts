import { BigNumber } from 'ethers';
import { GameStatus, PlayingType } from '../constants/enum';

export interface CreateSquidGameParams {
  startTimestamp: BigNumber;
  pot: BigNumber;
}

export interface GameRoundData {
  feed: string;
  start_price: BigNumber;
  start_timestamp: BigNumber;
  duration: BigNumber;
  end_price: BigNumber;
  score: BigNumber;
  game_type: BigNumber;
  total_players: BigNumber;
  playerJoinedCurrentRound: boolean;
  playerPlayCurrentRound: PlayingType;
  challengeResultCurrentRound: PlayingType;
  playerCurrentRoundChallengeResult: boolean;
  playerJoinedPastRound: boolean;
  feedPriceCurrentRound: BigNumber;
  totalPlayersPastRound: BigNumber;
}


export interface GameData {
  round: BigNumber;
  pot: BigNumber;
  gameState: GameState;
  playerJoined: boolean;
  joinedPlayers: BigNumber;
  startTimestamp: BigNumber;
  endTimestamp: BigNumber;
  lastChallengeTimestamp: BigNumber;
  playerWithdraw: boolean;
}

export interface GameGraph {
  id: string;
  intId: string;
  status: GameStatus;
  currentRound: string;
  createdAt: string;
  startedAt: string;
  startsAt: string;
  pastRoundChallengeResult: boolean;
  currentRoundTotalPlayers: string;
  currentRoundSetupAt: string;
  currentRoundStartsAt: string;
  currentRoundEndsAt: string;
  currentRoundType: string;
  endedAt: string;
  createdBy: string;
  duration: string;
  entry: string;
  players?: {
    id: string;
    player: Partial<PlayerGraph>;
  };
  earning?: Partial<EarningGraph>;
}

export interface PlayersGameGraph {
  players?: Array<{
    player: {
      id: string
    }
  }>;
}

export interface PlayerGraph {
  id: string;
  playCurrentRound: PlayingType;
  totalFinishedGames: string;
  totalJoinedGames: string;
  totalEarned: string;
  totalSpent: string;
  EarnedMinusSpent: string;
}

export interface EarningGraph {
  id: string;
  player: PlayerGraph;
  amount: string;
  claimed: boolean;
  at: string;
  game: string;
}

export enum GameState {
  Joining,
  Setup,
  Started,
  Finished,
  Quit
}