import React from 'react';

export const blockchainConfigs = [
  {
    routes: [
      {
        path: '/ethereum/token/:address',
        component: React.lazy(() => import('./ethereum/token')),
      },
    ],
  },
];
