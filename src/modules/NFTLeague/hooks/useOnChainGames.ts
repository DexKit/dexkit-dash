import {useWeb3} from 'hooks/useWeb3';
import {useQuery} from 'react-query';
import {ChainId, Web3State} from 'types/blockchain';
import {NFT_LEAGUES_FACTORY_ADDRESS} from '../constants';
import {getGamesData} from '../services/battleFactory';

export const useOnChainGames = (ids: string[]) => {
  const {web3State, account, getProvider, chainId} = useWeb3();

  const gamesQuery = useQuery(
    ['GET_NFT_LEAGUE_GAMES_ONCHAIN', account, chainId, ids],
    () => {
      if (!account || web3State !== Web3State.Done || !chainId) {
        return;
      }
      const provider = getProvider();
      const gameAddress =
        NFT_LEAGUES_FACTORY_ADDRESS[chainId as ChainId.Mumbai];

      return getGamesData(gameAddress, ids, provider);
    },
  );

  return gamesQuery;
};
