import React from 'react';

export const coinsLeagueConfigs = [
  {
    routes: [
      {
        auth: ['wallet'],
        path: '/coins-league/view/:address',
        component: React.lazy(() => import('./pages/GamesList')),
      },
    ],
  },
  {
    routes: [
      {
        auth: ['wallet'],
        path: '/coins-league/active-games',
        component: React.lazy(() => import('./pages/GamesInProgress')),
      },
    ],
  },
  {
    routes: [
      {
        auth: ['wallet'],
        path: '/coins-league/enter/:address',
        component: React.lazy(() => import('./pages/GameEnter')),
      },
    ],
  },
  {
    routes: [
      {
        auth: ['wallet'],
        path: '/coins-league/:address',
        component: React.lazy(() => import('./pages/GameEnter')),
      },
    ],
  },
  {
    routes: [
      {
        auth: ['wallet'],
        path: '/coins-league',
        component: React.lazy(() => import('./pages/GamesList')),
      },
    ],
  },
];
