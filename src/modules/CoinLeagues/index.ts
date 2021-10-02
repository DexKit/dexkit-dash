import React from 'react';

export const coinLeaguesConfigs = [
  {
    routes: [
      {
        path: '/coin-leagues/view/:address',
        component: React.lazy(() => import('./pages/GamesList')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/coin-leagues/active-games',
        component: React.lazy(() => import('./pages/GamesInProgress')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/coin-leagues/enter/:address',
        component: React.lazy(() => import('./pages/GameEnter')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/coin-leagues/:address',
        component: React.lazy(() => import('./pages/GameEnter')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/coin-leagues',
        component: React.lazy(() => import('./pages/GamesList')),
      },
    ],
  },
];
