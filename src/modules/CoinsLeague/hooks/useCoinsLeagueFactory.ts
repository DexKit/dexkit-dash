import {useWeb3} from 'hooks/useWeb3';
import {useCallback, useEffect, useState} from 'react';
import {
  COINS_LEAGUE_FACTORY_ADDRESS,
  createGame,
  getGamesAddressFromFactory,
} from 'modules/CoinsLeague/services/coinsLeagueFactory';
import {Web3State} from 'types/blockchain';
import {Game, GameParams} from 'types/coinsleague';
import {getGamesData} from '../services/coinsLeague';
import {useQuery} from 'react-query';

interface CallbackProps {
  onSubmit?: any;
  onConfirmation?: any;
  onError?: any;
}

export const useCoinsLeagueFactory = () => {
  const {web3State} = useWeb3();

  const onGameCreateCallback = useCallback(
    async (params: GameParams, callbacks?: CallbackProps) => {
      if (web3State !== Web3State.Done) {
        return;
      }
      try {
        const tx = await createGame(
          COINS_LEAGUE_FACTORY_ADDRESS['MUMBAI'],
          params,
        );
        callbacks?.onSubmit(tx.hash);
        await tx.wait();
        callbacks?.onConfirmation(tx.hash);
      } catch (e) {
        callbacks?.onError(e);
      }
    },
    [web3State],
  );

  const gamesAddressQuery = useQuery(['GetGamesAdddress', web3State], () => {
    if (web3State !== Web3State.Done) {
      return;
    }
    return getGamesAddressFromFactory(
      COINS_LEAGUE_FACTORY_ADDRESS['MUMBAI'],
      50,
    );
  });

  const gamesQuery = useQuery(
    ['GetGamesAdddress', web3State, gamesAddressQuery.data],
    () => {
      if (
        web3State !== Web3State.Done ||
        !gamesAddressQuery?.data ||
        !gamesAddressQuery?.data[0].length
      ) {
        return;
      }
      const gAddress = gamesAddressQuery?.data[0];
      return getGamesData(gAddress);
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
