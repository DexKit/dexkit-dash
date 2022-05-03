import {useWeb3} from 'hooks/useWeb3';
import {useQuery} from 'react-query';
import {GameStatus} from '../constants/enum';

import {GET_SQUID_LEAGUE_ALL_GAMES_QUERY} from '../services/gql';
import {getGraphClient} from '../services/graphql';
import {GameGraph} from '../utils/types';

export const useGamesGraph = (
  status?: GameStatus,
  account?: string,
  first: number = 10,
  skip: number = 0,
) => {
  const {chainId} = useWeb3();

  const gamesQuery = useQuery(
    ['GET_GAMES_SQUID_LEAGUE', chainId, status],
    () => {
      const client = getGraphClient(chainId);

      if (!chainId || !client) {
        return;
      }

      return client.query<
        {games: GameGraph[]},
        {status?: GameStatus; first: number; skip: number}
      >({
        query: GET_SQUID_LEAGUE_ALL_GAMES_QUERY(status),
        variables: {
          status,
          first,
          skip,
        },
      });
    },
  );

  return gamesQuery;
};
