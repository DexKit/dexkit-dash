import {BigNumber} from 'ethers';

export interface CoinFeed {
  base: string;
  baseName: string;
  quote: string;
  address: string;
  logo: string;
}

export interface GameGraph {
  id: string;
  intId: string;
  type: string;
  status: string;
  duration: string;
  numCoins: string;
  startsAt: string;
  numPlayers: string;
  currentPlayers: string;
  entry: string;
  startedAt?: string;
  endedAt?: string;
  title?: string;
  description?: string;
  smallDescription?: string;
}

export enum ChampionsEventRound {
  FIRST,
  SECOND,
  THIRD,
}

export interface PlayerGraph {
  id: string;
  totalWinnedGames: string;
  totalJoinedGames: string;
  totalFirstWinnedGames: string;
  totalThirdWinnedGames: string;
  totalSecondWinnedGames: string;
  totalEarned: string;
  EarnedMinusSpent: string;
}

export interface ChampionMetadata {
  image: string;
  description: string;
  name: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
}

export interface ChampionMetaItem {
  id: string;
  image: string;
  name: string;
  rarity: number;
}

export interface CoinLeaguesChampion {
  id: string;
  name: string;
  rarity?: number;
  description: string;
  image?: string;
  attack: number;
  defense: number;
  run: number;
}

export interface GameMetadata {
  gameId: string;
  title: string;
  smallDescription: string;
  description: string;
  creator: string;
}
export interface MultiplierInterface {
  playerAddress: string;
  kitBalance: BigNumber;
  bittBalance: BigNumber;
  isHoldingMultiplier: boolean;
  isHoldingKitMultiplier: boolean;
  isHoldingBittMultiplier: boolean;
  championsMultiplier: number;
  rarity: BigNumber;
  championId: BigNumber;
  isChampionsMultiplier: boolean;
}
