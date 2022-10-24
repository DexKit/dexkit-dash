import { useQuery } from 'react-query';
import { getProfile } from '../services/profileApi';

const GET_COIN_LEAGUE_PROFILE = 'GET_COIN_LEAGUE_PROFILE';

export function useCoinLeagueProfile(address: string) {
  return useQuery([GET_COIN_LEAGUE_PROFILE, address], () => {
    return getProfile(address);
  });
}
