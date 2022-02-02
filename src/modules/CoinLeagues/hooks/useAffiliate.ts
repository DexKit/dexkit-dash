import {useQuery} from '@apollo/client';
import {useEffect} from 'react';
import {POLL_INTERVAL_GAMES} from '../constants';
import {
  GET_AFFILIATES_ENTRIES,
  GET_PLAYER_AFFILIATE,
} from '../services/gql/affiliate';

import {client, getGraphClient, nftClient} from '../services/graphql';

import {useIsNFTGame} from './useCoinLeaguesFactory';
import {useLeaguesChainInfo} from './useLeaguesChainInfo';

export const usePlayerGames = () => {};

export interface AffiliateParams {
  address: string;
  first?: number;
  skip?: number;
}

export const useAffiliateEntries = (params: AffiliateParams, isNFT = false) => {
  const {address, first, skip} = params;
  const {chainId} = useLeaguesChainInfo();
  const isNFTGame = useIsNFTGame() || isNFT;
  const variables: any = {
    affiliate: address,
  };
  if (first) {
    variables.first = first;
  }
  if (skip) {
    variables.skip = skip;
  }

  const query = useQuery<{affiliates: any}>(GET_AFFILIATES_ENTRIES, {
    variables,
    client: getGraphClient(isNFTGame, chainId),
    pollInterval: POLL_INTERVAL_GAMES,
  });

  useEffect(() => {
    const refetchQuery = () => query.refetch();
    window.addEventListener('focus', refetchQuery);
    return () => window.removeEventListener('focus', refetchQuery);
  });

  return query;
};

export const useAffiliatePlayer = (address: string, isNFT = false) => {
  const {chainId} = useLeaguesChainInfo();
  const isNFTGame = useIsNFTGame() || isNFT;
  const variables = {
    affiliate: address,
  };

  const query = useQuery<{player: any}>(GET_PLAYER_AFFILIATE, {
    variables,
    client: getGraphClient(isNFTGame, chainId),
    pollInterval: POLL_INTERVAL_GAMES,
  });

  useEffect(() => {
    const refetchQuery = () => query.refetch();
    window.addEventListener('focus', refetchQuery);
    return () => window.removeEventListener('focus', refetchQuery);
  });

  return query;
};
