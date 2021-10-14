import {useQuery} from '@apollo/client';
import { BITBOY_TEAM } from '../constants';
import {FilterGame} from '../constants/enums';
import {
  GET_GAMES,
  GET_GAMES_WITH_DURATION,
  GET_GAMES_WITH_PLAYER,
} from '../services/gql/games';
import {client} from '../services/graphql';
import {GET_DURATION_FROM_FILTER} from '../utils/time';
import {GameGraph} from '../utils/types';

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
    variables.accounts = accounts?.map(a=> a.toLowerCase());;
    queryName = GET_GAMES_WITH_PLAYER;
  }

  if (filter === FilterGame.BitBoy) {
    variables.accounts = BITBOY_TEAM.map(a => a.address.toLowerCase() );
    queryName = GET_GAMES_WITH_PLAYER;
  }


  return useQuery<{games: GameGraph[]}>(queryName, {
    variables,
    client: client,
  });
};

export const useWaitingGames = (filter?: FilterGame, accounts?: string[]) => {
  const duration = GET_DURATION_FROM_FILTER(filter || FilterGame.ALL);
  const variables: any = {
    status: 'Waiting',
  };
  let queryName = GET_GAMES;

  if (duration) {
    variables.duration = duration;
    queryName = GET_GAMES_WITH_DURATION;
  }
  if (filter === FilterGame.Mine) {
    variables.accounts = accounts?.map(a=> a.toLowerCase());
    queryName = GET_GAMES_WITH_PLAYER;
  }

  if (filter === FilterGame.BitBoy) {
    variables.accounts = BITBOY_TEAM.map(a => a.address.toLowerCase() );
    queryName = GET_GAMES_WITH_PLAYER;
  }

  return useQuery<{games: GameGraph[]}>(queryName, {
    variables,
    client: client,
  });
};

export const useEndedGames = (filter?: FilterGame, accounts?: string[]) => {
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
    variables.accounts = accounts.map(a=> a.toLowerCase());;
    variables.player = accounts[0].toLowerCase();
    queryName = GET_GAMES_WITH_PLAYER;
  }

  if (filter === FilterGame.BitBoy) {
    variables.accounts = BITBOY_TEAM.map(a => a.address.toLowerCase() );
    queryName = GET_GAMES_WITH_PLAYER;
  }

  return useQuery<{games: GameGraph[]}>(queryName, {
    variables,
    client: client,
  });
};

export const usePlayerGames = () => {};
