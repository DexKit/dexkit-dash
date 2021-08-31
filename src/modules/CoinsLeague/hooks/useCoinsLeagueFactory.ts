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

export const useCoinsLeagueFactory = () => {
  const {web3State} = useWeb3();
  const [gamesAddress, setGamesAddress] = useState<string[]>();
  const [games, setGames] = useState<Game[]>();
  const [totalGames, setTotalGames] = useState<number>();

  const onGameCreateCallback = useCallback(
    async (params: GameParams) => {
      if (web3State !== Web3State.Done) {
        return;
      }
      const tx = await createGame(
        COINS_LEAGUE_FACTORY_ADDRESS['MUMBAI'],
        params,
      );
      const receipt = await tx.wait();
      alert('mined');
    },
    [web3State],
  );

  useEffect(() => {
    if (web3State !== Web3State.Done) {
      return;
    }
    getGamesAddressFromFactory(
      COINS_LEAGUE_FACTORY_ADDRESS['MUMBAI'],
      50,
    ).then((a) => {
      console.log(a);
      setGamesAddress(a[0]);
      setTotalGames(a[1]);
    });
  }, [web3State]);

  useEffect(() => {
    if (web3State !== Web3State.Done || !gamesAddress?.length) {
      return;
    }
    getGamesData(gamesAddress).then((g) => setGames(g));
  }, [web3State]);

  return {onGameCreateCallback, gamesAddress, games, totalGames};
};
