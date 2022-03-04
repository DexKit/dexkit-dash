import {useContext, useEffect, useMemo} from 'react';
import {ProfileContext} from '../context';

/**
 *
 * @param address
 * @returns
 */
export function useProfileUsername(address?: string) {
  const context = useContext(ProfileContext);

  const username = useMemo(() => {
    const index = context.profiles.findIndex(
      (profile) =>
        profile.address.toLocaleLowerCase() === address?.toLowerCase(),
    );

    if (index > -1) {
      return context.profiles[index].username;
    }

    return address;
  }, [address, String(context.profiles)]);

  return {username};
}
