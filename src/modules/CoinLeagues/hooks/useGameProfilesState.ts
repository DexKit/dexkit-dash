import { useQuery } from 'react-query';
import { getProfiles } from '../services/profileApi';
import { ProfileContextState } from '../utils/types';

const GAME_PROFILES_STATE = 'GAME_PROFILES_STATE';

export function useGameProfilesState(addresses?: string[]): ProfileContextState {
  const query = useQuery([GAME_PROFILES_STATE, String(addresses)], async () => {
    if (!addresses) {
      return;
    }
    const profiles = await getProfiles(addresses);

    return profiles;
  });

  return { profiles: query.data || [] };
}
