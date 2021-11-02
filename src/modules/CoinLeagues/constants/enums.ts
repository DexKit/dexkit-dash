export enum FilterGame {
  ALL = 'All',
  Fast = '1hr',
  Medium = '4hrs',
  Eight = '8hrs',
  Day = '24hrs',
  Week = 'Week',
  Mine = 'My Games',
  BitBoy = 'BitBoy '
}



export enum FilterPlayerGame {
  ALL = 'All',
  Waiting = 'Waiting',
  Started = 'Started',
  Ended = 'Ended'
}

export enum GameOrderBy{
  HighLevel = 'HighLevel',
  LowLevel = 'LowLevel',
  MostFull = 'MostFull',
  MostEmpty = 'MostEmpty',
  HighDuration = 'HighDuration',
  LowerDuration = 'LowerDuration',
  MoreCoins = 'MoreCoins',
  LessCoins = 'LessCoins',
}

export enum GameOrderByLabels{
  Level = 'Level',
  Duration = 'Duration',
  NumberOfCoins = 'Number of Coins',
  PlayersNeeded = 'Players Needed'

}