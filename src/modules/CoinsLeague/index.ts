import React from 'react';

export const coinsLeagueConfig = [
  {
    routes: [
      {
        path: '/coins-league',
        component: React.lazy(() => import('./pages/GamesList')),
      },
    ],
  },
];
