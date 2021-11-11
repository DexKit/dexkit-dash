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
  numPlayers: string;
  currentPlayers: string;
  entry: string;
  startedAt?: string;
  endedAt?: string;
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

export interface CoinLeaguesChampion {
  id: string;
  name: string;
  description: string;
  image?: string;
  attack: number;
  defense: number;
  run: number;
}
