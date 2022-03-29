import {useWeb3} from 'hooks/useWeb3';
import {useQuery} from 'react-query';
import {GameStatus} from '../constants/enum';
import {GET_NFT_LEAGUE_QUERY} from '../services/gql';
import {getGraphClient} from '../services/graphql';
import {GameGraph} from '../utils/types';

const GET_GAMES_NFT_LEAGUE = 'GET_GAMES_NFT_LEAGUE';

export const useGamesGraph = (
  status?: GameStatus,
  first: number = 10,
  skip: number = 0,
) => {
  const {chainId} = useWeb3();

  const gamesQuery = useQuery(
    [GET_GAMES_NFT_LEAGUE, chainId, status, first, skip],
    async () => {
      const client = getGraphClient(chainId);

      if (!chainId || !client) {
        return;
      }

      const result = await client.query<
        {games: GameGraph[]},
        {status?: GameStatus; first: number; skip: number}
      >({
        query: GET_NFT_LEAGUE_QUERY(status),
        variables: {
          status,
          first,
          skip,
        },
      });

      return result.data?.games;
    },
  );

  return gamesQuery;
};
