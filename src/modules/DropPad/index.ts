import React from 'react';

export const dropPadConfigs = [
  {
    routes: [
      {
        path: '/droppad/view/:address',
        component: React.lazy(() => import('./pages/DropPadView')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/droppad',
        component: React.lazy(() => import('./pages/DropPadList')),
      },
    ],
  },
];
