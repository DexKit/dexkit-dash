import {useWeb3} from 'hooks/useWeb3';
import {useQuery} from 'react-query';

import {GET_GAME} from '../services/gql';
import {getGraphClient} from '../services/graphql';
import {GameGraph} from '../utils/types';

export const useGameGraph = (id: string) => {
  const {chainId} = useWeb3();

  const gameQuery = useQuery(['GET_GAME_NFT_LEAGUE', chainId, id], async () => {
    const client = getGraphClient(chainId);

    if (!chainId || !client || !id) {
      return;
    }

    const query = await client.query<{game: GameGraph}>({
      query: GET_GAME,
      variables: {
        id,
      },
    });

    return query.data.game;
  });

  return gameQuery;
};
