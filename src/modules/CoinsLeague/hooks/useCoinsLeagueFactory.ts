import {useWeb3} from 'hooks/useWeb3';
import {useCallback, useEffect, useState} from 'react';
import {
  COINS_LEAGUE_FACTORY_ADDRESS,
  createGame,
  getGamesAddressFromFactory,
} from 'modules/CoinsLeague/services/coinsLeagueFactory';
import {ChainId, Web3State} from 'types/blockchain';
import {Game, GameParams} from 'types/coinsleague';
import {getGamesData} from '../services/coinsLeague';
import {useQuery} from 'react-query';
import { useNetworkProvider } from 'hooks/provider/useNetworkProvider';
import { EthereumNetwork } from 'shared/constants/AppEnums';
import { GET_LEAGUES_CHAIN_ID } from '../utils/constants';

interface CallbackProps {
  onSubmit?: any;
  onConfirmation?: any;
  onError?: any;
}

export const useCoinsLeagueFactory = () => {
  const {web3State, chainId} = useWeb3();
  const provider = useNetworkProvider(EthereumNetwork.matic, GET_LEAGUES_CHAIN_ID(chainId) );
  const onGameCreateCallback = useCallback(
    async (params: GameParams, callbacks?: CallbackProps) => {
      if (web3State !== Web3State.Done || !chainId ||  (chainId !== ChainId.Mumbai && chainId !== ChainId.Matic )) {
        return;
      }
      try {
        const tx = await createGame(
          COINS_LEAGUE_FACTORY_ADDRESS[chainId],
          params,
        );
        console.log(params);
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

  const gamesAddressQuery = useQuery(['GetGamesAdddress', chainId], () => {
    if ( !provider) {
      return;
    }
    
    return getGamesAddressFromFactory(
      COINS_LEAGUE_FACTORY_ADDRESS[GET_LEAGUES_CHAIN_ID(chainId)],
      50,
      provider
    );
  });

  const gamesQuery = useQuery(
    ['GetGamesAdddress', gamesAddressQuery.data],
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

  
  return {
    onGameCreateCallback,
    gamesAddress: gamesAddressQuery?.data ? gamesAddressQuery?.data[0] : [],
    games: gamesQuery?.data,
    totalGames: gamesAddressQuery?.data && gamesAddressQuery?.data[1],
    gamesAddressQuery,
    gamesQuery,
    refetch: gamesAddressQuery.refetch
  };
};
