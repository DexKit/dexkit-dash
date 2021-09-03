import React from 'react';

export const coinsLeagueConfigs = [
  {
    routes: [
      {
        path: '/coins-league/view/:address',
        component: React.lazy(() => import('./pages/GamesList')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/coins-league/enter/:address',
        component: React.lazy(() => import('./pages/GameEnter')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/coins-league',
        component: React.lazy(() => import('./pages/GamesList')),
      },
    ],
  },
];
