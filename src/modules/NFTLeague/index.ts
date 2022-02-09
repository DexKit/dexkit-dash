import React from 'react';
import {NFTLEAGUE_ROUTE} from 'shared/constants/routes';

export const nftleagueConfigs = [
  {
    routes: [
      {
        path: `${NFTLEAGUE_ROUTE}`,
        component: React.lazy(() => import('./pages/GamesList')),
      },
    ],
  },
];
