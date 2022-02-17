import React from 'react';
import ProfileUserSpan from 'modules/CoinLeagues/components/ProfileUserSpan';
import {ProfileContext} from 'modules/CoinLeagues/context';
import {useGameProfilesState} from 'modules/CoinLeagues/hooks/useGameProfilesState';

export default () => {
  const profilesState = useGameProfilesState([
    '0xD36453e2cb362818f0B407C1bEab52f1692036A6',
    '0xE2C57Efab264B7e99131A9501573bC742d1265a3',
  ]);

  return (
    <div>
      <ProfileContext.Provider value={profilesState}>
        <div>
          <ProfileUserSpan address='0xD36453e2cb362818f0B407C1bEab52f1692036A6' />
        </div>
        <div>
          <ProfileUserSpan address='0xE2C57Efab264B7e99131A9501573bC742d1265a3' />
        </div>
        <div>
          <ProfileUserSpan address='0xE2C57Efab264B7e99131A9501573bC742d1265a33' />
        </div>
      </ProfileContext.Provider>
    </div>
  );
};
