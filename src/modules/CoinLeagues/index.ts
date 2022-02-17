import React from 'react';
import {COINLEAGUENFT_ROUTE} from 'shared/constants/routes';

export const coinLeaguesConfigs = [
  {
    routes: [
      {
        path: '/champions',
        component: React.lazy(() => import('./pages/champions/index')),
      },
      {
        path: '/testing',
        component: React.lazy(() => import('./pages/Profile/test')),
      },
      {
        path: '/coin-league/profile/:address/my-champions',
        component: React.lazy(() => import('./pages/ProfileCollection/index')),
      },
      {
        path: '/coin-league/profile/:address/edit',
        component: React.lazy(() => import('./pages/ProfileEdit/index')),
      },
      {
        path: '/coin-league/profile/:address',
        component: React.lazy(() => import('./pages/Profile/index')),
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
        path: '/coin-league/trading-analysis',
        component: React.lazy(() => import('./pages/TradingAnalysis')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/coin-league/affiliates',
        component: React.lazy(() => import('./pages/Affiliate')),
      },
    ],
  },
  {
    routes: [
      {
        path: `${COINLEAGUENFT_ROUTE}/active-games`,
        component: React.lazy(() => import('./pages/GamesInProgress')),
      },
    ],
  },
  {
    routes: [
      {
        path: `${COINLEAGUENFT_ROUTE}/:id`,
        component: React.lazy(() => import('./pages/GameEnter')),
      },
    ],
  },
  {
    routes: [
      {
        path: COINLEAGUENFT_ROUTE,
        component: React.lazy(() => import('./pages/GamesList')),
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
        path: '/coin-league/room/:room/game/:id',
        component: React.lazy(() => import('./pages/GameEnter')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/coin-league/room/:room/active-games',
        component: React.lazy(() => import('./pages/GamesInProgress')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/coin-league/room/:room',
        component: React.lazy(() => import('./pages/GamesList')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/coin-league/active-games',
        component: React.lazy(() => import('./pages/GamesInProgress')),
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
        path: '/coin-league/enter/:id',
        component: React.lazy(() => import('./pages/GameEnter')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/coin-league/:id',
        component: React.lazy(() => import('./pages/GameEnter')),
      },
    ],
  },

  {
    routes: [
      {
        path: '/coin-league',
        component: React.lazy(() => import('./pages/GamesList')),
      },
    ],
  },
];
