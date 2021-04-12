import React from 'react';

export const historyConfigs = [
  {
    routes: [
      {
        path: '/history/order/:type/:address',
        component: React.lazy(() => import('./Order')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/history/transaction/:type/:address',
        component: React.lazy(() => import('./Transaction')),
      },
    ],
  }
];
