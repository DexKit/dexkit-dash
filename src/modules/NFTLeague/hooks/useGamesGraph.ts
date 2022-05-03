import {useWeb3} from 'hooks/useWeb3';
import {useQuery} from 'react-query';
import {GameStatus} from '../constants/enum';
import {GET_NFT_LEAGUE_QUERY} from '../services/gql';
import {getGraphClient} from '../services/graphql';
import {GameGraph} from '../utils/types';

const GET_GAMES_NFT_LEAGUE = 'GET_GAMES_NFT_LEAGUE';

export const useGamesGraph = (
  status?: GameStatus,
  account?: string,
  first: number = 10,
  skip: number = 0,
) => {
  const {chainId} = useWeb3();

  const gamesQuery = useQuery(
    [GET_GAMES_NFT_LEAGUE, chainId, status, first, skip, account],
    async () => {
      const client = getGraphClient(chainId);

      if (!chainId || !client) {
        return;
      }

      const result = await client.query<
        {games: GameGraph[]},
        {status?: GameStatus; first: number; skip: number; account?: string}
      >({
        query: GET_NFT_LEAGUE_QUERY(status, account),
        variables: {
          account,
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
