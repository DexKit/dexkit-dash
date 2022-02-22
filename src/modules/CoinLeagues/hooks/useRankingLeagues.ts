import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { ChainId } from 'types/blockchain';
import { POLL_INTERVAL_GAMES } from '../constants';
import {
  GET_RANKING_MOST_EARNED,
  GET_RANKING_MOST_JOINED,
  GET_RANKING_MOST_WINNED,
  GET_RANKING_MOST_PROFIT,
} from '../services/gql/ranking';
import { getGraphClient } from '../services/graphql';
import { PlayerGraph } from '../utils/types';

export enum RankingType {
  MostWinner = 'Most Winner',
  MostJoined = 'Most Joined',
  MostEarned = 'Most Earned',
  MostProfit = 'Most Profit',
}

export const useRanking = (type: RankingType, isNFTGame = false, chainId = ChainId.Matic) => {

  const queryString = useMemo(() => {
    switch (type) {
      case RankingType.MostWinner:
        return GET_RANKING_MOST_WINNED
      case RankingType.MostJoined:
        return GET_RANKING_MOST_JOINED
      case RankingType.MostEarned:
        return GET_RANKING_MOST_EARNED
      case RankingType.MostProfit:
        return GET_RANKING_MOST_PROFIT

    }
  }, [type])


  const query = useQuery<{ players: PlayerGraph[] }>(queryString, {
    client: getGraphClient(isNFTGame, chainId),
    pollInterval: POLL_INTERVAL_GAMES,
  });

  return query;


}



export const useRankingMostWinned = (isNFTGame = false, chainId = ChainId.Matic) => {
  const query = useQuery<{ players: PlayerGraph[] }>(GET_RANKING_MOST_WINNED, {
    client: getGraphClient(isNFTGame, chainId),
    pollInterval: POLL_INTERVAL_GAMES,
  });

  return query;
};

export const useRankingMostJoined = (isNFTGame = false, chainId = ChainId.Matic) => {
  const query = useQuery<{ players: PlayerGraph[] }>(GET_RANKING_MOST_JOINED, {
    client: getGraphClient(isNFTGame, chainId),
    pollInterval: POLL_INTERVAL_GAMES,
  });

  return query;
};

export const useRankingMostEarned = (isNFTGame = false, chainId = ChainId.Matic) => {
  const query = useQuery<{ players: PlayerGraph[] }>(GET_RANKING_MOST_EARNED, {
    client: getGraphClient(isNFTGame, chainId),
    pollInterval: POLL_INTERVAL_GAMES,
  });

  return query;
};

export const useRankingMostProfit = (isNFTGame = false, chainId = ChainId.Matic) => {
  const query = useQuery<{ players: PlayerGraph[] }>(GET_RANKING_MOST_PROFIT, {
    client: getGraphClient(isNFTGame, chainId),
    pollInterval: POLL_INTERVAL_GAMES,
  });

  return query;
};
