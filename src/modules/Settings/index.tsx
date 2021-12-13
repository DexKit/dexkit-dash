import React from 'react';

export const settingsConfig = [
  {
    routes: [
      {
        path: '/settings',
        component: React.lazy(() => import('./pages')),
      },
    ],
  },
];
