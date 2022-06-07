import { BigNumber } from 'ethers';
import { ChainId } from 'types/blockchain';

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

export interface GameProfile {
  id: string;
  address: string;
  username: string;
  profileImage: string;
  coverImage: string;
  tokenAddress: string;
  tokenId: string;
  chainId: ChainId;
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

export interface ProfileStats {
  totalWinnedGames: string;
  totalFirstWinnedGames: string;
  totalSecondWinnedGames: string;
  totalThirdWinnedGames: string;
  totalJoinedGames: string;
  totalEarned: string;
  totalSpent: string;
}

export enum CoinLeagueGames {
  CoinLeague,
  CoinLeagueNFT,
  SquidGame,
  NFTLeague,
}

export interface ProfileContextState {
  profiles: GameProfile[];
}
