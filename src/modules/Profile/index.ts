import React from 'react';

export const profileConfig = [
  {
    routes: [
      {
        path: '/profile',
        component: React.lazy(() => import('./pages/index')),
      },
    ],
  },
];
