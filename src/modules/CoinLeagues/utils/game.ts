import {BigNumber} from '@ethersproject/bignumber';
import {ethers} from 'ethers';
import {BITBOY_TEAM, CREATOR_ADDRESSES} from '../constants';
import {GameOrderBy, GameOrderByLabels} from 'modules/CoinLeagues/constants/enums';

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
    {value: GameOrderBy.HighLevel, label: 'Higher Level'},
    {value: GameOrderBy.LowLevel, label: 'Lower Level'},
    {value: GameOrderBy.MostFull, label: 'Most Full'},
    {value: GameOrderBy.MostEmpty, label: 'Most Empty'},
    {value: GameOrderBy.HighDuration, label: 'Higher Duration'},
    {value: GameOrderBy.LowerDuration, label: 'Lower Duration'},
    {value: GameOrderBy.MoreCoins, label: 'More Coins'},
    {value: GameOrderBy.LessCoins, label: 'Less Coins'},
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
