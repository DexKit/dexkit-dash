import {useWeb3} from 'hooks/useWeb3';
import {useQuery} from 'react-query';

import {GET_GAME} from '../services/gql';
import {getGraphClient} from '../services/graphql';
import {GameGraph} from '../utils/types';

export const useGameGraph = (id: string) => {
  const {chainId} = useWeb3();

  const gameQuery = useQuery(['GET_GAME_SQUID_LEAGUE', chainId, id], () => {
    const client = getGraphClient(chainId);

    if (!chainId || !client) {
      return;
    }

    return client.query<GameGraph, {id: string}>({
      query: GET_GAME,
      variables: {
        id,
      },
    });
  });

  return gameQuery;
};
