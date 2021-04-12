import React from 'react';
import { Redirect } from 'react-router';

export const dashBoardConfigs = [
  {
    routes: [
      {
        path: '/dashboard/overview',
        component: React.lazy(() => import('./Overview'))
      },
    ],
  },
  {
    auth: ['wallet'],
    routes: [
      {
        path: '/dashboard/wallet',
        component: React.lazy(() => import('./Wallet')),
      },
    ],
  },
  {
    auth: ['wallet'],
    routes: [
      {
        path: '/dashboard/staking',
        component: React.lazy(() => import('./Staking')),
      },
    ],
  },
  {
    auth: ['wallet'],
    routes: [
      {
        path: '/dashboard/kits',
        component: React.lazy(() => import('./Kits')),
      },
    ],
  },
  {
    auth: ['token'],
    routes: [
      {
        path: '/dashboard/token/:address',
        component: React.lazy(() => import('./Token')),
      },
    ],
  },
  {
    auth: ['token'],
    routes: [
      {
        path: '/dashboard/token',
        exact: true,
        component: () => <Redirect to={`/dashboard/token/${process.env.REACT_APP_DEFAULT_TOKEN}`} />,
      },
    ],
  }
];
