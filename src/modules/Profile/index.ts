import React from 'react';

export const profileConfig = [
  {
    routes: [
      {
        path: '/profile/points',
        component: React.lazy(() => import('./pages/PointsHistory')),
      },
      {
        path: '/profile',
        component: React.lazy(() => import('./pages/index')),
      },
      {
        path: '/ranking',
        component: React.lazy(() => import('./pages/Ranking')),
      },
    ],
  },
];
