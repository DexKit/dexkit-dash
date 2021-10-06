import {useWeb3} from 'hooks/useWeb3';
import {useCallback, useEffect, useState} from 'react';
import {
  COIN_LEAGUES_FACTORY_ADDRESS,
  createGame,
  getCreatedGamesAddressFromFactory,
  getEndedGamesAddressFromFactory,
  getGamesAddressFromFactory,
  getStartedGamesAddressFromFactory,
} from 'modules/CoinLeagues/services/coinLeaguesFactory';
import {ChainId, Web3State} from 'types/blockchain';
import {Game, GameParams} from 'types/coinsleague';
import {getGamesData} from '../services/coinLeagues';
import {useQuery} from 'react-query';
import { useNetworkProvider } from 'hooks/provider/useNetworkProvider';
import { EthereumNetwork } from 'shared/constants/AppEnums';
import { GET_LEAGUES_CHAIN_ID } from '../utils/constants';

interface CallbackProps {
  onSubmit?: any;
  onConfirmation?: any;
  onError?: any;
}

export const useCoinLeaguesFactory = () => {
  const {web3State, chainId} = useWeb3();
  const provider = useNetworkProvider(EthereumNetwork.matic, GET_LEAGUES_CHAIN_ID(chainId) );
  const onGameCreateCallback = useCallback(
    async (params: GameParams, callbacks?: CallbackProps) => {
      if (web3State !== Web3State.Done || !chainId ||  (chainId !== ChainId.Mumbai && chainId !== ChainId.Matic )) {
        return;
      }
      try {
        const tx = await createGame(
          COIN_LEAGUES_FACTORY_ADDRESS[chainId],
          params,
        );
        callbacks?.onSubmit(tx.hash);
        await tx.wait();
        callbacks?.onConfirmation(tx.hash);
      } catch (e) {
        console.log(e)
        callbacks?.onError(e);
      }
    },
    [web3State, chainId],
  );

  const gamesAddressQuery = useQuery(['GetGamesAddress', chainId], () => {
    if ( !provider) {
      return;
    }
    
    return getGamesAddressFromFactory(
      COIN_LEAGUES_FACTORY_ADDRESS[GET_LEAGUES_CHAIN_ID(chainId)],
      13,
      provider
    );
  });

  const gamesQuery = useQuery(
    ['GetGamesDataAddress', gamesAddressQuery.data],
    () => {
      if (
        !gamesAddressQuery?.data ||
        !gamesAddressQuery?.data[0].length || 
        !provider
      ) {
        return;
      }
      const gAddress = gamesAddressQuery?.data[0];
      return getGamesData(gAddress, provider);
    },
  );

  const createdGamesAddressQuery = useQuery(['GetCreatedGamesAdddress', chainId], () => {
    if ( !provider) {
      return;
    }
    
    return getCreatedGamesAddressFromFactory(
      COIN_LEAGUES_FACTORY_ADDRESS[GET_LEAGUES_CHAIN_ID(chainId)],
      11,
      provider
    );
  });

  const createdGamesQuery = useQuery(
    ['GetCreatedGamesData', createdGamesAddressQuery.data],
    () => {
      if (
        !createdGamesAddressQuery?.data ||
        !createdGamesAddressQuery?.data[0].length || 
        !provider
      ) {
        return;
      }
      const gAddress = createdGamesAddressQuery?.data[0];
      return getGamesData(gAddress, provider);
    },
  );

  const startedGamesAddressQuery = useQuery(['GetStartedGamesAdddress', chainId], () => {
    if ( !provider) {
      return;
    }
    
    return getStartedGamesAddressFromFactory(
      COIN_LEAGUES_FACTORY_ADDRESS[GET_LEAGUES_CHAIN_ID(chainId)],
      11,
      provider
    );
  });

  const startedGamesQuery = useQuery(
    ['GetStartedGamesData', startedGamesAddressQuery.data],
    () => {
      if (
        !startedGamesAddressQuery?.data ||
        !startedGamesAddressQuery?.data[0].length || 
        !provider
      ) {
        return;
      }
      const gAddress = startedGamesAddressQuery?.data[0];
      return getGamesData(gAddress, provider);
    },
  );

  const endedGamesAddressQuery = useQuery(['GetEndedGamesAdddress', chainId], () => {
    if ( !provider) {
      return;
    }
    
    return getEndedGamesAddressFromFactory(
      COIN_LEAGUES_FACTORY_ADDRESS[GET_LEAGUES_CHAIN_ID(chainId)],
      11,
      provider
    );
  });

  const endedGamesQuery = useQuery(
    ['GetEndedGamesData', endedGamesAddressQuery.data],
    () => {
      if (
        !endedGamesAddressQuery?.data ||
        !endedGamesAddressQuery?.data[0].length || 
        !provider
      ) {
        return;
      }
      const gAddress = endedGamesAddressQuery?.data[0];
      return getGamesData(gAddress, provider);
    },
  );



  return {
    onGameCreateCallback,
    gamesAddress: gamesAddressQuery?.data ? gamesAddressQuery?.data[0] : [],
    games: gamesQuery?.data,
    totalGames: gamesAddressQuery?.data && gamesAddressQuery?.data[1],
    refetch: gamesAddressQuery.refetch,
    gamesAddressQuery,
    gamesQuery,
    // created queries
    createdGames: createdGamesQuery?.data,
    totalCreatedGames: createdGamesAddressQuery?.data && createdGamesAddressQuery?.data[1],
    createdGamesQuery,
    createdGamesAddressQuery, 
    refetchCreated: createdGamesAddressQuery.refetch,
    // started queries
    startedGames: startedGamesQuery?.data,
    totalStartedGames: startedGamesAddressQuery?.data && startedGamesAddressQuery?.data[1],
    startedGamesQuery,
    startedGamesAddressQuery, 
    refetchStarted: startedGamesAddressQuery.refetch,
    // started queries
    endedGames: endedGamesQuery?.data,
    totalEndedGames: endedGamesAddressQuery?.data && endedGamesAddressQuery?.data[1],
    endedGamesQuery,
    endedGamesAddressQuery, 
    refetchEnded: endedGamesAddressQuery.refetch
  };
};
