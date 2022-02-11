import React from 'react';
import {SQUIDLEAGUE_ROUTE} from 'shared/constants/routes';

export const nftleagueConfigs = [
  {
    routes: [
      {
        path: `${SQUIDLEAGUE_ROUTE}`,
        component: React.lazy(() => import('./pages/GamesList')),
      },
    ],
  },
];
