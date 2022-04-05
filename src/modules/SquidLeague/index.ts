import React from 'react';
import {SQUIDLEAGUE_ROUTE} from 'shared/constants/routes';

export const squidLeagueConfigs = [
  {
    routes: [
      {
        path: `${SQUIDLEAGUE_ROUTE}/create`,
        component: React.lazy(() => import('./pages/CreateGame')),
      },
      {
        path: `${SQUIDLEAGUE_ROUTE}/explore`,
        component: React.lazy(() => import('./pages/Explore')),
      },
      {
        path: `${SQUIDLEAGUE_ROUTE}/my-games`,
        component: React.lazy(() => import('./pages/MyGames')),
      },
      {
        path: `${SQUIDLEAGUE_ROUTE}/:id`,
        component: React.lazy(() => import('./pages/Game')),
      },
      {
        path: `${SQUIDLEAGUE_ROUTE}`,
        component: React.lazy(() => import('./pages/GamesList')),
      },
    ],
  },
];
