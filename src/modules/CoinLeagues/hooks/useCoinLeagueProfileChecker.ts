import {useQuery} from 'react-query';
import {getProfile} from '../services/profileApi';

const PROFILE_USERNAME_CHECK_QUERY = 'PROFILE_USERNAME_CHECK_QUERY';

export function useCoinLeagueProfileChecker(username: string) {
  return useQuery([PROFILE_USERNAME_CHECK_QUERY, username], async () => {
    const profile = await getProfile(username);

    if (profile.id) {
      return {isAvailable: false};
    }

    return {isAvailable: true};
  });
}
