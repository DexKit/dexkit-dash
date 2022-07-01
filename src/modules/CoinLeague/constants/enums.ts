export enum FilterGame {
  ALL = 'All',
  Fast = '1hr',
  Medium = '4hrs',
  Eight = '8hrs',
  Day = '24hrs',
  Week = 'Week',
  Mine = 'My Games',
}

export enum GameDuration {
  ALL,
  FAST,
  MEDIUM,
  EIGHT,
  DAY,
  WEEK,
}

export enum FilterPlayerGame {
  ALL = 'All',
  Waiting = 'Waiting',
  Started = 'Started',
  Aborted = 'Aborted',
  Ended = 'Ended',
}

export enum CoinLeagueGameStatus {
  All = 'All',
  Waiting = 'Waiting',
  Started = 'Started',
  Aborted = 'Aborted',
  Ended = 'Ended',
}

export enum GameOrderBy {
  HighLevel = 'HighLevel',
  LowLevel = 'LowLevel',
  MostFull = 'MostFull',
  MostEmpty = 'MostEmpty',
  HighDuration = 'HighDuration',
  LowerDuration = 'LowerDuration',
  MoreCoins = 'MoreCoins',
  LessCoins = 'LessCoins',
  AboutStart = 'AboutStart',
}

export enum GameOrderByLabels {
  Level = 'Level',
  Duration = 'Duration',
  NumberOfCoins = 'Number of Coins',
  PlayersNeeded = 'Players Needed',
}

export enum GameType {
  ALL,
  Bull,
  Bear,
}

export enum GameLevel {
  All,
  Beginner,
  Intermediate,
  Advanced,
  Expert,
  Master,
  GrandMaster,
}

export enum NumberOfPLayers {
  ALL,
  TWO = 2,
  THREE = 3,
  FIVE = 5,
  TEN = 10,
}

export enum GameStakeAmount {
  ALL,
  TWO = 2,
  FIVE = 5,
  TEN = 10,
}

export enum RoomType {
  Main = 'Main Room',
  NFT = 'NFT Room',
  Stable = 'Stable',
}
