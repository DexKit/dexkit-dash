import {BigNumber} from '@ethersproject/bignumber';
import {ethers} from 'ethers';
import {BITBOY_TEAM, CREATOR_ADDRESSES} from '../constants';
import {
  GameLevel,
  GameOrderBy,
  GameOrderByLabels,
} from 'modules/CoinLeagues/constants/enums';
import {gql} from 'graphql-tag';

export const isGameCreator = (address?: string) => {
  if (!address) {
    return false;
  }
  return CREATOR_ADDRESSES.map((a) => a.toLowerCase()).includes(
    address.toLowerCase(),
  );
};

export const GET_BITBOY_NAME = (address?: string) => {
  if (!address) {
    return false;
  }
  return BITBOY_TEAM.find(
    (a) => a.address.toLowerCase() === address.toLowerCase(),
  );
};

export const GET_GAME_ORDER_OPTIONS = () => {
  return [
    {
      value: GameOrderBy.HighLevel,
      label: 'Higher Level',
      messageId: 'app.coinLeagues.higherLevel',
    },
    {
      value: GameOrderBy.LowLevel,
      label: 'Lower Level',
      messageId: 'app.coinLeagues.lowerLevel',
    },
    {
      value: GameOrderBy.MostFull,
      label: 'Most Full',
      messageId: 'app.coinLeagues.mostFull',
    },
    {
      value: GameOrderBy.MostEmpty,
      label: 'Most Empty',
      messageId: 'app.coinLeagues.mostEmpty',
    },
    {
      value: GameOrderBy.HighDuration,
      label: 'Higher Duration',
      messageId: 'app.coinLeagues.higherDuration',
    },
    {
      value: GameOrderBy.LowerDuration,
      label: 'Lower Duration',
      messageId: 'app.coinLeagues.lowerDuration',
    },
    {
      value: GameOrderBy.MoreCoins,
      label: 'More Coins',
      messageId: 'app.coinLeagues.moreCoins',
    },
    {
      value: GameOrderBy.LessCoins,
      label: 'Less Coins',
      messageId: 'app.coinLeagues.lessCoins',
    },
  ];
};

export const GET_GAME_ORDER_LABELS_OPTIONS = () => {
  return [
    {value: GameOrderByLabels.Level, label: 'Level'},
    {value: GameOrderByLabels.Duration, label: 'Duration'},
    {value: GameOrderByLabels.PlayersNeeded, label: 'Players Needed'},
    {value: GameOrderByLabels.NumberOfCoins, label: 'Number Of Coins'},
  ];
};

export const GET_GAME_ORDER_VARIABLES = (orderBy?: GameOrderBy) => {
  switch (orderBy) {
    case GameOrderBy.HighLevel:
      return {orderBy: 'entry', orderDirection: 'desc'};
    case GameOrderBy.LowLevel:
      return {orderBy: 'entry', orderDirection: 'asc'};
    case GameOrderBy.MostFull:
      return {orderBy: 'currentPlayers', orderDirection: 'desc'};
    case GameOrderBy.MostEmpty:
      return {orderBy: 'currentPlayers', orderDirection: 'asc'};
    case GameOrderBy.HighDuration:
      return {orderBy: 'duration', orderDirection: 'desc'};
    case GameOrderBy.LowerDuration:
      return {orderBy: 'duration', orderDirection: 'asc'};
    case GameOrderBy.MoreCoins:
      return {orderBy: 'numCoins', orderDirection: 'desc'};
    case GameOrderBy.LessCoins:
      return {orderBy: 'numCoins', orderDirection: 'asc'};
    default:
      return {orderBy: 'entry', orderDirection: 'desc'};
  }
};

export const GET_GAME_LEVEL = (entry: BigNumber) => {
  if (entry.lt(ethers.utils.parseEther('5'))) {
    return 'Beginner';
  } else if (entry.lt(ethers.utils.parseEther('10'))) {
    return 'Intermediate';
  } else if (entry.lt(ethers.utils.parseEther('50'))) {
    return 'Advanced';
  } else if (entry.lt(ethers.utils.parseEther('100'))) {
    return 'Expert';
  } else if (entry.lt(ethers.utils.parseEther('500'))) {
    return 'Master';
  } else {
    return 'Grand Master';
  }
};

export const GET_GAME_LEVEL_AMOUNTS = (gameLevel: GameLevel) => {
  switch (gameLevel) {
    case GameLevel.Beginner:
      return ethers.utils.parseEther('1');
    case GameLevel.Intermediate:
      return ethers.utils.parseEther('5');
    case GameLevel.Advanced:
      return ethers.utils.parseEther('10');
    case GameLevel.Expert:
      return ethers.utils.parseEther('50');
    case GameLevel.Master:
      return ethers.utils.parseEther('250');
    case GameLevel.GrandMaster:
      return ethers.utils.parseEther('500');
    default:
      return ethers.utils.parseEther('0');
  }
};

export function renderEarningsField(params: string) {
  return `earnings(where: {${params}}){
    place
    amount
    claimed 
  }`;
}

export function getGamesQuery(params: any) {
  let queryVariableParams = [];
  let queryParams = [];
  let whereParams = [];
  let earningsWhere = [];

  if (params.skip) {
    queryVariableParams.push('$skip: Int');
    queryParams.push('skip: $skip');
  }

  if (params.first) {
    queryVariableParams.push('$first: Int');
    queryParams.push('first: $first');
  }

  if (params.status) {
    queryVariableParams.push('$status: String!');
    whereParams.push('status: $status');
  }

  if (params.duration) {
    queryVariableParams.push('$duration: Int');
    whereParams.push('duration: $duration');
  }

  if (params.numPlayers) {
    queryVariableParams.push('$numPlayers: BigInt!');
    whereParams.push('numPlayers: $numPlayers');
  }

  if (params.type) {
    queryVariableParams.push('$type: BigInt!');
    whereParams.push('type: $type');
  }

  if (params.orderDirection) {
    queryVariableParams.push('$orderDirection: String');
    queryParams.push('orderDirection: $orderDirection');
  }

  if (params.orderBy) {
    queryVariableParams.push('$orderBy: String');
    queryParams.push('orderBy: $orderBy');
  }

  if (params.entry) {
    queryVariableParams.push('$entry: String');
    whereParams.push('entry: $entry');
  }

  if (params.isBitboyTeam) {
    queryVariableParams.push('$isBitboyTeam: Boolean');
    whereParams.push('isBitboyTeam: $isBitboyTeam');
  }

  if (params.accounts) {
    queryVariableParams.push('$accounts: [String]');
    whereParams.push('playerAddresses_contains: $accounts');
  }

  if (params.player) {
    queryVariableParams.push('$player: String');
    earningsWhere.push('player_contains: $player');
  }

  let paramsString = queryVariableParams.join(', ');

  let receiveParamsString = queryParams.join(', ');

  let whereParamsString = whereParams.join(', ');

  let earningsWhereString = earningsWhere.join(', ');

  let query = gql`
  query GetGames(${paramsString}) {
    games(where: {${whereParamsString}}, ${receiveParamsString}) {
        id
        intId
        type
        duration
        status
        numCoins
        numPlayers
        currentPlayers
        entry
        startedAt
        endedAt
        ${earningsWhereString ? renderEarningsField(earningsWhereString) : ''}
      }
  }
`;

  return query;
}
