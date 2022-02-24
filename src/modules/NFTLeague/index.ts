import React from 'react';

export const nftLeagueConfig = [
  {
    routes: [
      {
        path: '/nft-league/create',
        component: React.lazy(() => import('./pages/CreateGame')),
      },
      {
        path: '/nft-league/:id',
        component: React.lazy(() => import('./pages/Game')),
      },
      {
        path: '/nft-league',
        component: React.lazy(() => import('./pages/index')),
      },
    ],
  },
];
