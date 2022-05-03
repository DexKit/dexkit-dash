import {providers, BigNumber} from 'ethers';
import {useWeb3} from 'hooks/useWeb3';
import {useQuery} from 'react-query';
import {Web3State} from 'types/blockchain';

import {getGameRoundData} from '../services/squidGame';

export const useOnChainCurrentRoundGame = (
  currentRound?: BigNumber,
  gameAddress?: string,
) => {
  const {web3State, account, getProvider, chainId} = useWeb3();

  const gameQuery = useQuery(
    [
      'GET_SQUID_LEAGUE_GAME_CURRENT_ROUND',
      account,
      chainId,
      currentRound,
      gameAddress,
    ],
    () => {
      if (
        !account ||
        web3State !== Web3State.Done ||
        !chainId ||
        !currentRound ||
        !gameAddress
      ) {
        return;
      }

      const provider = getProvider();
      const ethersProvider = new providers.Web3Provider(provider);

      return getGameRoundData(
        gameAddress,
        currentRound.toNumber(),
        ethersProvider,
        account,
      );
    },
  );

  return gameQuery;
};
