import { providers } from 'ethers';
import { useWeb3 } from 'hooks/useWeb3';
import { useQuery } from 'react-query';
import { Web3State } from 'types/blockchain';

import { getGameData } from '../services/squidGame';

export const useOnChainGameData = (gameAddress?: string) => {
  const { web3State, account, getProvider, chainId } = useWeb3();

  const gameQuery = useQuery(
    ['GET_SQUID_LEAGUE_GAME_DATA', account, chainId, gameAddress],
    () => {
      if (!account || web3State !== Web3State.Done || !chainId || !gameAddress) {
        return;
      }
      console.log(gameAddress);
      const provider = getProvider();
      const ethersProvider = new providers.Web3Provider(provider)

      return getGameData(gameAddress, ethersProvider);
    },
  );

  return gameQuery;
};
