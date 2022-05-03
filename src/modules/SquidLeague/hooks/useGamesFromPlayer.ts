import { useWeb3 } from 'hooks/useWeb3';
import { useQuery } from 'react-query';
import { GET_GAMES_FROM_PLAYER } from '../services/gql';
import { getGraphClient } from '../services/graphql';
import { GameGraph } from '../utils/types';

export const useGamesFromPlayerGraph = (
  account?: string,
  first: number = 10,
  skip: number = 0,
) => {
  const { chainId } = useWeb3();

  const gamesQuery = useQuery(['GET_GAMES_FROM_PLAYER_SQUID_LEAGUE', chainId, account], () => {
    const client = getGraphClient(chainId);

    if (!chainId || !client || !account) {
      return;
    }

    return client.query<
      { player: { games: { game: GameGraph }[] } },
      { first: number; skip: number, id: string }
    >({
      query: GET_GAMES_FROM_PLAYER,
      variables: {
        id: account.toLowerCase(),
        first,
        skip,
      },
    });
  });

  return gamesQuery;
};
