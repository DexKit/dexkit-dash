import React from 'react';

export const coinsLeagueConfigs = [
  {
    routes: [
      {
        auth: ['wallet'],
        path: '/coin-leagues/view/:address',
        component: React.lazy(() => import('./pages/GamesList')),
      },
    ],
  },
  {
    routes: [
      {
        auth: ['wallet'],
        path: '/coin-leagues/active-games',
        component: React.lazy(() => import('./pages/GamesInProgress')),
      },
    ],
  },
  {
    routes: [
      {
        auth: ['wallet'],
        path: '/coin-leagues/enter/:address',
        component: React.lazy(() => import('./pages/GameEnter')),
      },
    ],
  },
  {
    routes: [
      {
        auth: ['wallet'],
        path: '/coin-leagues/:address',
        component: React.lazy(() => import('./pages/GameEnter')),
      },
    ],
  },
  {
    routes: [
      {
        auth: ['wallet'],
        path: '/coin-leagues',
        component: React.lazy(() => import('./pages/GamesList')),
      },
    ],
  },
];
