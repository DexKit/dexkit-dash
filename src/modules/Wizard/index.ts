import React from 'react';

export const wizardConfig = [
  {
    routes: [
      {
        path: '/wizard/collection/:contract',
        component: React.lazy(() => import('./pages/collection/index')),
      },
      {
        path: '/wizard/deploy/collection',
        component: React.lazy(() => import('./pages/deploy/Collection')),
      },
      {
        path: '/wizard/deploy/token',
        component: React.lazy(() => import('./pages/deploy/Token')),
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
