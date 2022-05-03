import {ethers} from 'ethers';
import {useWeb3} from 'hooks/useWeb3';
import {useQuery} from 'react-query';
import {GET_NFT_LEAGUE_FACTORY_ADDRESS} from '../constants';
import {getBattleFactoryContract} from '../services/battleFactory';

export function useCoinFeed(feed?: string) {
  const {chainId, getProvider} = useWeb3();

  return useQuery<ethers.BigNumber>(
    ['GET_COIN_FEED', chainId, feed, getProvider],
    async () => {
      if (!feed || !chainId) {
        return;
      }

      const contract = await getBattleFactoryContract(
        GET_NFT_LEAGUE_FACTORY_ADDRESS(chainId),
        getProvider(),
      );

      return await contract.getPriceFeed(feed);
    },
    {refetchInterval: 2000},
  );
}
