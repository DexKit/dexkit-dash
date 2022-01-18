import { useQuery } from '@apollo/client';
import { useWeb3 } from 'hooks/useWeb3';
import { useEffect } from 'react';
import { POLL_INTERVAL_GAMES } from '../constants';
import {
  CoinLeagueGameStatus,
  GameDuration,
  GameLevel,
  GameType,
  NumberOfPLayers,
} from '../constants/enums';

import { getGraphClient } from '../services/graphql';
import {
  getGamesQuery,
  GET_GAME_LEVEL_AMOUNTS,
  GET_GAME_ORDER_VARIABLES,
} from '../utils/game';
import { GET_DURATION_FROM_FILTER_V2 } from '../utils/time';
import { GameGraph } from '../utils/types';
import { useIsNFTGame } from './useCoinLeaguesFactory';
import { GameFiltersState } from './useGamesFilter';

interface GamesFilterParams {
  accounts?: string[];
  filters?: GameFiltersState;
}

export const usePlayerGames = () => { };

export interface CoinLeagueGamesParams extends GamesFilterParams {
  status: string;
  first?: number;
  skip?: number;
  player?: string;
}

export const useCoinLeagueGames = (params: CoinLeagueGamesParams, isNFT = false) => {
  const { chainId } = useWeb3();

  const { accounts, filters, status, first, skip, player } = params;
  const isNFTGame = useIsNFTGame() || isNFT;

  const variables: any = {};

  if (status) {
    if (status !== CoinLeagueGameStatus.All) {
      variables.status = status;
    }
  }

  if (skip) {
    variables.skip = skip;
  }

  if (first) {
    variables.first = first;
  } else {
    variables.first = 100;
  }

  const order = GET_GAME_ORDER_VARIABLES(filters?.orderByGame);

  variables.orderBy = order.orderBy;
  variables.orderDirection = order.orderDirection;

  if (filters?.duration !== GameDuration.ALL) {
    variables.duration = GET_DURATION_FROM_FILTER_V2(
      filters?.duration || GameDuration.ALL,
    );
  }

  if (filters?.gameLevel !== GameLevel.All) {
    let entryAmount = GET_GAME_LEVEL_AMOUNTS(
      filters?.gameLevel || GameLevel.All, chainId
    ).toString();

    variables.entry = entryAmount;
  }

  if (filters?.numberOfPlayers !== NumberOfPLayers.ALL) {
    variables.numPlayers = filters?.numberOfPlayers;
  }

  if (filters?.gameType !== GameType.ALL) {
    if (filters?.gameType === GameType.Bull) {
      variables.type = 'Bull';
    } else if (filters?.gameType === GameType.Bear) {
      variables.type = 'Bear';
    }
  }

  if (filters?.isMyGames) {
    variables.accounts = accounts?.map((a) => a.toLowerCase());
  } else if (filters?.isBitboy) {
    variables.isBitboyTeam = true;
  }

  if (player) {
    variables.player = player.toLowerCase();
  }

  let gqlQuery = getGamesQuery(variables);

  const query = useQuery<{ games: GameGraph[] }>(gqlQuery, {
    variables,
    client: getGraphClient(isNFTGame, chainId),
    pollInterval: POLL_INTERVAL_GAMES,
  });

  useEffect(() => {
    const refetchQuery = () => query.refetch();
    window.addEventListener('focus', refetchQuery);
    return () => window.removeEventListener('focus', refetchQuery);
  });

  return query;
};
