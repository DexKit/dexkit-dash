import {useQuery} from '@apollo/client';
import {POLL_INTERVAL_GAMES} from '../constants';
import {
  GET_RANKING_MOST_EARNED,
  GET_RANKING_MOST_JOINED,
  GET_RANKING_MOST_WINNED,
  GET_RANKING_MOST_PROFIT,
} from '../services/gql/ranking';
import {client, nftClient} from '../services/graphql';
import {PlayerGraph} from '../utils/types';

export const useRankingMostWinned = (isNFTGame = false) => {
  const query = useQuery<{players: PlayerGraph[]}>(GET_RANKING_MOST_WINNED, {
    client: isNFTGame ? nftClient: client,
    pollInterval: POLL_INTERVAL_GAMES,
  });

  return query;
};

export const useRankingMostJoined = (isNFTGame = false) => {
  const query = useQuery<{players: PlayerGraph[]}>(GET_RANKING_MOST_JOINED, {
    client: isNFTGame ? nftClient: client,
    pollInterval: POLL_INTERVAL_GAMES,
  });

  return query;
};

export const useRankingMostEarned = (isNFTGame = false) => {
  const query = useQuery<{players: PlayerGraph[]}>(GET_RANKING_MOST_EARNED, {
    client: isNFTGame ? nftClient: client,
    pollInterval: POLL_INTERVAL_GAMES,
  });

  return query;
};

export const useRankingMostProfit = (isNFTGame = false) => {
  const query = useQuery<{players: PlayerGraph[]}>(GET_RANKING_MOST_PROFIT, {
    client: isNFTGame ? nftClient: client,
    pollInterval: POLL_INTERVAL_GAMES,
  });

  return query;
};
