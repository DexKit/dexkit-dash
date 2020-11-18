import React from 'react';

export const myAppsConfigs = [
  {
    auth: ['wallet'],
    routes: [
      {
        path: '/my-apps/manage',
        component: React.lazy(() => import('./manage')),
      },
    ],
  },
];
