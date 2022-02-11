import {useWeb3} from 'hooks/useWeb3';
import {useQuery} from 'react-query';
import {ChainId, Web3State} from 'types/blockchain';
import {NFT_LEAGUE_FACTORY_ADDRESS} from '../constants';
import {getCoinFeedData} from '../services/battleFactory';

export const useOnChainCoinFeed = (id: string) => {
  const {web3State, account, getProvider, chainId} = useWeb3();

  const coinFeedQuery = useQuery(
    ['GET_NFT_LEAGUE_COIN_FEED_ONCHAIN', account, chainId, id],
    () => {
      if (!account || web3State !== Web3State.Done || !chainId) {
        return;
      }
      const provider = getProvider();
      const gameAddress = NFT_LEAGUE_FACTORY_ADDRESS[chainId as ChainId.Mumbai];

      return getCoinFeedData(gameAddress, id, provider);
    },
  );

  return coinFeedQuery;
};
