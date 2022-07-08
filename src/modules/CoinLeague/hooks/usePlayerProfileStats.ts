import { gql, useQuery } from '@apollo/client';
import { getGraphClient } from '../services/graphql';
import { ProfileStats } from '../utils/types';
import { useLeaguesChainInfo } from './useLeaguesChainInfo';

const GET_PLAYER_PROFILE_STATS_QUERY = gql`
  query getPlayerProfileStats($address: ID!) {
    stats: player(id: $address) {
      totalWinnedGames
      totalFirstWinnedGames
      totalSecondWinnedGames
      totalThirdWinnedGames
      totalJoinedGames
      totalEarned
      totalSpent
    }
  }
`;

export function usePlayerProfileStats(account?: string, isNFT = false) {
  const { chainId } = useLeaguesChainInfo();

  return useQuery<{ stats: ProfileStats }>(GET_PLAYER_PROFILE_STATS_QUERY, {
    variables: { address: account },
    client: getGraphClient(isNFT, chainId),
  });
}
