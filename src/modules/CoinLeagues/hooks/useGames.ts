import {useQuery} from '@apollo/client';
import {useEffect} from 'react';
import {BITBOY_TEAM, POLL_INTERVAL_GAMES} from '../constants';
import {
  CoinLeagueGameStatus,
  FilterGame,
  GameDuration,
  GameLevel,
  GameOrderBy,
  GameType,
  NumberOfPLayers,
} from '../constants/enums';
import {
  GET_GAMES,
  GET_GAMES_WITH_DURATION,
  GET_GAMES_WITH_PLAYER,
} from '../services/gql/games';
import {client} from '../services/graphql';
import {
  getWaitingGamesQuery,
  GET_GAME_LEVEL_AMOUNTS,
  GET_GAME_ORDER_VARIABLES,
} from '../utils/game';
import {
  GET_DURATION_FROM_FILTER,
  GET_DURATION_FROM_FILTER_V2,
} from '../utils/time';
import {GameGraph} from '../utils/types';
import {GameFiltersState} from './useGamesFilter';

export const useActiveGames = (filter?: FilterGame, accounts?: string[]) => {
  const duration = GET_DURATION_FROM_FILTER(filter || FilterGame.ALL);
  const variables: any = {
    status: 'Started',
  };
  let queryName = GET_GAMES;

  if (duration) {
    variables.duration = duration;
    queryName = GET_GAMES_WITH_DURATION;
  }
  if (filter === FilterGame.Mine) {
    variables.accounts = accounts?.map((a) => a.toLowerCase());
    queryName = GET_GAMES_WITH_PLAYER;
  }

  if (filter === FilterGame.BitBoy) {
    variables.accounts = BITBOY_TEAM.map((a) => a.address.toLowerCase());
    queryName = GET_GAMES_WITH_PLAYER;
  }

  const query = useQuery<{games: GameGraph[]}>(queryName, {
    variables,
    client: client,
    pollInterval: POLL_INTERVAL_GAMES,
  });

  useEffect(() => {
    const refetchQuery = () => query.refetch();
    window.addEventListener('focus', refetchQuery);
    return () => window.removeEventListener('focus', refetchQuery);
  });

  return query;
};

interface GamesFilterParams {
  filter?: FilterGame;
  accounts?: string[];
  orderBy?: GameOrderBy;
  filters?: GameFiltersState;
}

interface WaintingGamesParams extends GamesFilterParams {}

export const useWaitingGames = (params: WaintingGamesParams) => {
  const {filter, accounts, orderBy, filters} = params;

  const variables: any = {
    status: 'Waiting',
  };

  const order = GET_GAME_ORDER_VARIABLES(filters?.orderByGame);

  variables.orderBy = order.orderBy;
  variables.orderDirection = order.orderDirection;

  if (filters?.duration !== GameDuration.ALL) {
    variables.duration = GET_DURATION_FROM_FILTER_V2(
      filters?.duration || GameDuration.ALL,
    );
  }

  if (filters?.numberOfPlayers !== NumberOfPLayers.ALL) {
    variables.numPlayers = filters?.numberOfPlayers;
  }

  if (filters?.gameType !== GameType.ALL) {
    if (filters?.gameType === GameType.Bull) {
      variables.type = 'Bull';
    } else {
      variables.type = 'Bear';
    }
  }

  if (filters?.isMyGames) {
    variables.accounts = accounts?.map((a) => a.toLowerCase());
  } else if (filters?.isBitboy) {
    variables.isBitboyTeam = true;
    variables.accounts = BITBOY_TEAM.map((a) => a.address.toLowerCase());
  }

  let gqlQuery = getWaitingGamesQuery(variables);

  const query = useQuery<{games: GameGraph[]}>(gqlQuery, {
    variables,
    client: client,
    pollInterval: POLL_INTERVAL_GAMES,
  });

  useEffect(() => {
    const refetchQuery = () => query.refetch();
    window.addEventListener('focus', refetchQuery);
    return () => window.removeEventListener('focus', refetchQuery);
  });

  return query;
};

// TODO: transform this hook into a generic where 'status' is a param.
export const useEndedGames = (params: GamesFilterParams) => {
  const {filter, accounts, orderBy, filters} = params;

  const duration = GET_DURATION_FROM_FILTER(filter || FilterGame.ALL);

  const variables: any = {
    status: 'Ended',
  };

  let queryName = GET_GAMES;

  if (duration) {
    variables.duration = duration;
    queryName = GET_GAMES_WITH_DURATION;
  }
  if (filter === FilterGame.Mine && accounts) {
    variables.accounts = accounts.map((a) => a.toLowerCase());
    variables.player = accounts[0].toLowerCase();
    queryName = GET_GAMES_WITH_PLAYER;
  }

  if (filter === FilterGame.BitBoy) {
    variables.accounts = [BITBOY_TEAM[3]];
    queryName = GET_GAMES_WITH_PLAYER;
  }

  let gqlQuery = getWaitingGamesQuery(variables);

  const query = useQuery<{games: GameGraph[]}>(gqlQuery, {
    variables,
    client: client,
    pollInterval: POLL_INTERVAL_GAMES,
  });

  useEffect(() => {
    const refetchQuery = () => query.refetch();
    window.addEventListener('focus', refetchQuery);
    return () => window.removeEventListener('focus', refetchQuery);
  });

  return query;
};

export const usePlayerGames = () => {};

export interface CoinLeagueGamesParams extends GamesFilterParams {
  status: string;
  first?: number;
  skip?: number;
  player?: string;
}

// TODO: REMOVER unused code.
export const useCoinLeagueGames = (params: CoinLeagueGamesParams) => {
  const {filter, accounts, orderBy, filters, status, first, skip, player} =
    params;

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
      filters?.gameLevel || GameLevel.All,
    ).toString();

    variables.entry = entryAmount;
  }

  if (filters?.numberOfPlayers !== NumberOfPLayers.ALL) {
    variables.numPlayers = filters?.numberOfPlayers;
  }

  if (filters?.gameType !== GameType.ALL) {
    if (filters?.gameType === GameType.Bull) {
      variables.type = 'Bull';
    } else {
      variables.type = 'Bear';
    }
  }

  if (filters?.isMyGames) {
    variables.accounts = accounts?.map((a) => a.toLowerCase());
  } else if (filters?.isBitboy) {
    variables.isBitboyTeam = true;
  }

  if (player) {
    variables.player = player;
  }

  let gqlQuery = getWaitingGamesQuery(variables);

  const query = useQuery<{games: GameGraph[]}>(gqlQuery, {
    variables,
    client: client,
    pollInterval: POLL_INTERVAL_GAMES,
  });

  useEffect(() => {
    const refetchQuery = () => query.refetch();
    window.addEventListener('focus', refetchQuery);
    return () => window.removeEventListener('focus', refetchQuery);
  });

  return query;
};
