import React from 'react';

export const coinsLeagueConfigs = [
  {
    routes: [
      {
        path: '/coins-league',
        component: React.lazy(() => import('./pages/GamesList')),
      },
    ],
  },
];
