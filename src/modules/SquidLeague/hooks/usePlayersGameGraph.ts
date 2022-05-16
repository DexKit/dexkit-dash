import { useWeb3 } from 'hooks/useWeb3';
import { useQuery } from 'react-query';

import { GET_PLAYERS_FROM_GAME } from '../services/gql';
import { getGraphClient } from '../services/graphql';
import { PlayersGameGraph } from '../utils/types';

export const usePlayersGamesGraph = (id: string, first = 50, skip = 0) => {
    const { chainId } = useWeb3();

    const gameQuery = useQuery(['GET_PLAYERS_GAME_SQUID_LEAGUE', chainId, id, first, skip], () => {
        const client = getGraphClient(chainId);

        if (!chainId || !client) {
            return;
        }

        return client.query<PlayersGameGraph, { id: string, first: number, skip: number }>({
            query: GET_PLAYERS_FROM_GAME,
            variables: {
                id,
                first,
                skip
            },
        });
    });

    return gameQuery;
};
