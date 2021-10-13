import React from 'react';

export const coinLeaguesConfigs = [
  {
    routes: [
      {
        path: '/coin-leagues/room/:room/game/:address',
        component: React.lazy(() => import('./pages/GameEnter')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/coin-leagues/room/:room/active-games',
        component: React.lazy(() => import('./pages/GamesInProgressV2')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/coin-leagues/room/:room',
        component: React.lazy(() => import('./pages/GamesListV2')),
      },
    ],
  },
 
  {
    routes: [
      {
        path: '/coin-leagues/active-games',
        component: React.lazy(() => import('./pages/GamesInProgressV2')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/coin-leagues/discover-games',
        component: React.lazy(() => import('./pages/JoinGames')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/coin-leagues/my-games',
        component: React.lazy(() => import('./pages/MyGames')),
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
        component: React.lazy(() => import('./pages/GamesListV2')),
      },
    ],
  },
];
