import React from 'react';

import {ProfileContextState} from '../utils/types';

export const ProfileContext = React.createContext<ProfileContextState>({
  profiles: [],
});
