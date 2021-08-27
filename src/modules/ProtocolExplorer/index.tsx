import React from 'react';

export const protocolExplorerConfigs = [
  {
    routes: [
      {
        path: '/explorer/:address',
        component: React.lazy(() => import('./pages')),
      },
    ],
  },
];
