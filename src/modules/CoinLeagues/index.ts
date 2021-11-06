import React from 'react';

export const coinLeaguesConfigs = [
  {
    routes: [
      {
        path: '/champions',
        component: React.lazy(() => import('./pages/champions/index')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/coin-league/how-to-play',
        component: React.lazy(() => import('./pages/HowToPlay')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/coin-league/champions/event',
        component: React.lazy(() => import('./pages/Event/index')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/coin-league/room/:room/game/:address',
        component: React.lazy(() => import('./pages/GameEnter')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/coin-league/room/:room/active-games',
        component: React.lazy(() => import('./pages/GamesInProgressV2')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/coin-league/room/:room',
        component: React.lazy(() => import('./pages/GamesListV2')),
      },
    ],
  },

  {
    routes: [
      {
        path: '/coin-league/active-games',
        component: React.lazy(() => import('./pages/GamesInProgressV2')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/coin-league/ranking',
        component: React.lazy(() => import('./pages/Ranking')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/coin-league/discover-games',
        component: React.lazy(() => import('./pages/JoinGames')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/coin-league/my-games',
        component: React.lazy(() => import('./pages/MyGames')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/coin-league/enter/:address',
        component: React.lazy(() => import('./pages/GameEnter')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/coin-league/:address',
        component: React.lazy(() => import('./pages/GameEnter')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/coin-league',
        component: React.lazy(() => import('./pages/GamesListV2')),
      },
    ],
  },
];
