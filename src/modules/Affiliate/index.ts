import React from 'react';

export const affiliateConfigs = [
  {
    routes: [
      {
        auth: ['wallet'],
        path: '/affiliate',
        component: React.lazy(() => import('./page/wrapper')),
      },
    ],
  },
];
