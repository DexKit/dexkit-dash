import React from 'react';

export const wizardConfig = [
  {
    routes: [
      {
        path: '/wizard/deploy/:slug',
        component: React.lazy(() => import('./pages/deploy/Setup')),
      },
      {
        path: '/wizard/deploy',
        component: React.lazy(() => import('./pages/deploy/index')),
      },
      {
        path: '/wizard',
        component: React.lazy(() => import('./pages/Index')),
      },
    ],
  },
];
