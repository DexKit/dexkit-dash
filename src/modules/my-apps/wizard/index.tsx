import React from 'react';

export const wizardConfigs = [
  {
    routes: [
      {
        path: '/my-apps/wizard/aggregator',
        component: React.lazy(() => import('./aggregator')),
      },
      {
        path: '/my-apps/wizard/exchange',
        component: React.lazy(() => import('./exchange')),
      },
      {
        path: '/my-apps/wizard/marketplace/:slug',
        component: React.lazy(() => import('./marketplace')),
      },
      {
        path: '/my-apps/wizard/marketplace',
        component: React.lazy(() => import('./marketplace')),
      }
    ],
  },
];
