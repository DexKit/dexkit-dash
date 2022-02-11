import {useWeb3} from 'hooks/useWeb3';
import {useQuery} from 'react-query';
import {ChainId, Web3State} from 'types/blockchain';
import {SQUID_LEAGUE_FACTORY_ADDRESS} from '../constants';
import {getGameRoundData} from '../services/squidGame';

export const useOnChainGames = (currentRound: number) => {
  const {web3State, account, getProvider, chainId} = useWeb3();

  const gameQuery = useQuery(
    ['GET_SQUID_LEAGUE_GAME_CURRENT_ROUND', account, chainId, currentRound],
    () => {
      if (!account || web3State !== Web3State.Done || !chainId) {
        return;
      }
      const provider = getProvider();
      const gameAddress =
        SQUID_LEAGUE_FACTORY_ADDRESS[chainId as ChainId.Mumbai];

      return getGameRoundData(gameAddress, currentRound, provider);
    },
  );

  return gameQuery;
};
