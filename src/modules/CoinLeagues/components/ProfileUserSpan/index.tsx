import {useProfileUsername} from 'modules/CoinLeagues/hooks/useProfileUsername';
import React from 'react';

interface Props {
  address?: string;
}

const ProfileUserSpan: React.FC<Props> = ({address}) => {
  const profile = useProfileUsername(address);

  return <span>{profile.username}</span>;
};

export default React.memo(ProfileUserSpan);
