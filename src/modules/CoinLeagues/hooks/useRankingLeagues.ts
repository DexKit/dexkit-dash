import {useQuery} from '@apollo/client';
import { POLL_INTERVAL_GAMES } from '../constants';
import { GET_RANKING_MOST_JOINED, GET_RANKING_MOST_WINNED } from '../services/gql/ranking';
import { client } from '../services/graphql';
import { PlayerGraph } from '../utils/types';




export const useRankingMostWinned = () => {

    const query =  useQuery<{players: PlayerGraph[]}>(GET_RANKING_MOST_WINNED, {
        client: client,
        pollInterval: POLL_INTERVAL_GAMES
      });

    return query;

}

export const useRankingMostJoined = () => {

    const query =  useQuery<{players: PlayerGraph[]}>(GET_RANKING_MOST_JOINED, {
        client: client,
        pollInterval: POLL_INTERVAL_GAMES
      });

    return query;


    
}