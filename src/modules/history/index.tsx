import React from 'react';
import { Redirect } from 'react-router';

export const historyConfigs = [
  {
    routes: [
      {
        path: '/history/order/:address',
        component: React.lazy(() => import('./Order')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/history/transaction/:address',
        component: React.lazy(() => import('./Transaction')),
      },
    ],
  },
  {
    component: () => <Redirect to='/error-pages/error-404' />,
  },
];
