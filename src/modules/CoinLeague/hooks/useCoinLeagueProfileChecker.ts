import {useQuery} from 'react-query';
import {getProfile} from '../services/profileApi';

const PROFILE_USERNAME_CHECK_QUERY = 'PROFILE_USERNAME_CHECK_QUERY';

export function useCoinLeagueProfileChecker(username: string) {
  return useQuery([PROFILE_USERNAME_CHECK_QUERY, username], async () => {
    if (!username) {
      return;
    }

    return getProfile(username)
      .then((profile) => {
        return {isAvailable: false};
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 404) {
            return {isAvailable: true};
          }
        }

        return err;
      });
  });
}
