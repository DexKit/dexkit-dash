import { BigNumber } from '@ethersproject/bignumber';
import { ethers } from 'ethers';
import { BITBOY_TEAM, CoinToPlay, CoinToPlayInterface, CREATOR_ADDRESSES, CREATOR_LABELS, NativeCoinAddress } from '../constants';
import {
  GameLevel,
  GameOrderBy,
  GameOrderByLabels,
} from 'modules/CoinLeague/constants/enums';
import { gql } from 'graphql-tag';
import { ChainId } from 'types/blockchain';
import { CoinLeagueGames } from './types';

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

export const GET_CREATOR_LABELS = (address?: string) => {
  if (!address) {
    return false;
  }
  const creator = CREATOR_LABELS.find(
    (a) => a.address.toLowerCase() === address.toLowerCase(),
  );
  if (creator) {
    return creator.label;
  }
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
      value: GameOrderBy.AboutStart,
      label: 'About to Start',
      messageId: 'app.coinLeagues.aboutstart',
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
    { value: GameOrderByLabels.Level, label: 'Level' },
    { value: GameOrderByLabels.Duration, label: 'Duration' },
    { value: GameOrderByLabels.PlayersNeeded, label: 'Players Needed' },
    { value: GameOrderByLabels.NumberOfCoins, label: 'Number Of Coins' },
  ];
};

export const GET_GAME_ORDER_VARIABLES = (orderBy?: GameOrderBy) => {
  switch (orderBy) {
    case GameOrderBy.HighLevel:
      return { orderBy: 'entry', orderDirection: 'desc' };
    case GameOrderBy.LowLevel:
      return { orderBy: 'entry', orderDirection: 'asc' };
    case GameOrderBy.AboutStart:
      return { orderBy: 'startsAt', orderDirection: 'asc' };
    case GameOrderBy.MostFull:
      return { orderBy: 'currentPlayers', orderDirection: 'desc' };
    case GameOrderBy.MostEmpty:
      return { orderBy: 'currentPlayers', orderDirection: 'asc' };
    case GameOrderBy.HighDuration:
      return { orderBy: 'duration', orderDirection: 'desc' };
    case GameOrderBy.LowerDuration:
      return { orderBy: 'duration', orderDirection: 'asc' };
    case GameOrderBy.MoreCoins:
      return { orderBy: 'numCoins', orderDirection: 'desc' };
    case GameOrderBy.LessCoins:
      return { orderBy: 'numCoins', orderDirection: 'asc' };
    default:
      return { orderBy: 'entry', orderDirection: 'desc' };
  }
};

export const GET_GAME_LEVEL = (entry: BigNumber, chainId = ChainId.Matic, coinToPlayAddress?: string) => {
  const coinToPlay = CoinToPlay[chainId]?.find(c => c.address.toLowerCase() === coinToPlayAddress?.toLowerCase());
  if (coinToPlay && coinToPlay.address.toLowerCase() !== NativeCoinAddress.toLowerCase()) {
    if (entry.lt(ethers.utils.parseEther('1'))) {
      return 'Beginner';
    } else if (entry.lt(ethers.utils.parseEther('5'))) {
      return 'Intermediate';
    } else if (entry.lt(ethers.utils.parseEther('50'))) {
      return 'Advanced';
    } else if (entry.lt(ethers.utils.parseEther('100'))) {
      return 'Expert';
    } else if (entry.lt(ethers.utils.parseEther('250'))) {
      return 'Master';
    } else {
      return 'Grand Master';
    }
  }


  if (chainId === ChainId.Binance) {
    if (entry.lt(ethers.utils.parseEther('0.02'))) {
      return 'Beginner';
    } else if (entry.lt(ethers.utils.parseEther('0.05'))) {
      return 'Intermediate';
    } else if (entry.lt(ethers.utils.parseEther('0.1'))) {
      return 'Advanced';
    } else if (entry.lt(ethers.utils.parseEther('0.3'))) {
      return 'Expert';
    } else if (entry.lt(ethers.utils.parseEther('1'))) {
      return 'Master';
    } else {
      return 'Grand Master';
    }
  }

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

export const GET_GAME_LEVEL_AMOUNTS_UNITS = (
  gameLevel: GameLevel,
  chainId = ChainId.Matic,
  coinToPlayAddress?: string,
) => {
  const coinToPlay = CoinToPlay[chainId]?.find(c => c.address.toLowerCase() === coinToPlayAddress?.toLowerCase()) as CoinToPlayInterface;
  return ethers.utils.formatUnits(GET_GAME_LEVEL_AMOUNTS(gameLevel, chainId, coinToPlayAddress), coinToPlay?.decimals || 18);
};

export const GET_GAME_LEVEL_AMOUNTS = (
  gameLevel: GameLevel,
  chainId = ChainId.Matic,
  coinToPlayAddress?: string,
) => {
  const coinToPlay = CoinToPlay[chainId]?.find(c => c.address.toLowerCase() === coinToPlayAddress?.toLowerCase()) as CoinToPlayInterface;
  const isStable = coinToPlay && coinToPlay.address.toLowerCase() !== NativeCoinAddress.toLowerCase();
  switch (gameLevel) {
    case GameLevel.Beginner:
      if (isStable) {
        return ethers.utils.parseUnits('0.001', coinToPlay.decimals);
      }
      switch (chainId) {
        case ChainId.Matic:
          return ethers.utils.parseEther('1');
        case ChainId.Binance:
          return ethers.utils.parseEther('0.01');
        default:
          return ethers.utils.parseEther('1');
      }

    case GameLevel.Intermediate:
      if (isStable) {
        return ethers.utils.parseUnits('5', coinToPlay.decimals);
      }
      switch (chainId) {
        case ChainId.Matic:
          return ethers.utils.parseEther('5');
        case ChainId.Binance:
          return ethers.utils.parseEther('0.05');
        default:
          return ethers.utils.parseEther('5');
      }

    case GameLevel.Advanced:
      if (isStable) {
        return ethers.utils.parseUnits('25', coinToPlay.decimals);
      }
      switch (chainId) {
        case ChainId.Matic:
          return ethers.utils.parseEther('10');
        case ChainId.Binance:
          return ethers.utils.parseEther('0.1');
        default:
          return ethers.utils.parseEther('10');
      }
    case GameLevel.Expert:
      if (isStable) {
        return ethers.utils.parseUnits('100', coinToPlay.decimals);
      }
      switch (chainId) {
        case ChainId.Matic:
          return ethers.utils.parseEther('50');
        case ChainId.Binance:
          return ethers.utils.parseEther('0.3');
        default:
          return ethers.utils.parseEther('50');
      }
    case GameLevel.Master:
      if (isStable) {
        return ethers.utils.parseUnits('250', coinToPlay.decimals);
      }

      switch (chainId) {
        case ChainId.Matic:
          return ethers.utils.parseEther('250');
        case ChainId.Binance:
          return ethers.utils.parseEther('1');
        default:
          return ethers.utils.parseEther('250');
      }
    case GameLevel.GrandMaster:
      if (isStable) {
        return ethers.utils.parseUnits('500', coinToPlay.decimals);
      }
      switch (chainId) {
        case ChainId.Matic:
          return ethers.utils.parseEther('500');
        case ChainId.Binance:
          return ethers.utils.parseEther('2');
        default:
          return ethers.utils.parseEther('500');
      }
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

export function renderWithdrawsField(params: string) {
  return `withdraws(where: {${params}}){
    player{
      id
    }
    at
  }`;
}

export function getGamesQuery(params: any) {
  let queryVariableParams = [];
  let queryParams = [];
  let whereParams = [];
  let earningsWhere = [];
  let withdrawsWhere = [];

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
    withdrawsWhere.push('player_contains: $player');
  }

  let paramsString = queryVariableParams.join(', ');

  let receiveParamsString = queryParams.join(', ');

  let whereParamsString = whereParams.join(', ');

  let earningsWhereString = earningsWhere.join(', ');

  let withdrawWhereString = withdrawsWhere.join(', ');

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
        createdAt
        startedAt
        startsAt
        abortedAt
        coinToPlay
        endedAt
        ${earningsWhereString ? renderEarningsField(earningsWhereString) : ''}
        ${withdrawWhereString ? renderWithdrawsField(withdrawWhereString) : ''}
      }
  }
`;

  return query;
}

export function reduceAddress(address?: string) {
  if (address) {
    return address.substring(2, 8).toUpperCase();
  }

  return '';
}

export function slugToCoinLeagueGame(slug: string) {
  switch (slug) {
    case 'coin-league':
      return CoinLeagueGames.CoinLeague;
    case 'squid-game':
      return CoinLeagueGames.SquidGame;
    case 'coin-league-nft':
      return CoinLeagueGames.CoinLeagueNFT;
    case 'nft-league':
      return CoinLeagueGames.NFTLeague;
    default:
      return CoinLeagueGames.CoinLeague;
  }
}

export function coinLeagueGamesToSlug(game: CoinLeagueGames) {
  switch (game) {
    case CoinLeagueGames.CoinLeague:
      return 'coin-league';
    case CoinLeagueGames.CoinLeagueNFT:
      return 'coin-league-nft';
    case CoinLeagueGames.SquidGame:
      return 'squid-game';
    case CoinLeagueGames.NFTLeague:
      return 'nft-league';
  }
}
