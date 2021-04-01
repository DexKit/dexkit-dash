import React from 'react';
import { Redirect } from 'react-router';

export const dashBoardConfigs = [
  {
    routes: [
      {
        path: '/dashboards/crm',
        component: React.lazy(() => import('./CRM')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/dashboards/analytics',
        component: React.lazy(() => import('./Analytics')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/dashboards/crypto',
        component: React.lazy(() => import('./Crypto')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/dashboards/metrics',
        component: React.lazy(() => import('./Metrics')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/dashboards/widgets',
        component: React.lazy(() => import('./Widgets')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/dashboards/overview',
        component: React.lazy(() => import('./Overview')),
      },
    ],
  },
  {
    auth: ['wallet'],
    routes: [
      {
        path: '/dashboards/wallet',
        component: React.lazy(() => import('./Wallet')),
      },
    ],
  },
  {
    auth: ['wallet'],
    routes: [
      {
        path: '/dashboards/staking',
        component: React.lazy(() => import('./Staking')),
      },
    ],
  },
  {
    auth: ['wallet'],
    routes: [
      {
        path: '/dashboards/kits',
        component: React.lazy(() => import('./Kits')),
      },
    ],
  },
  {
    auth: ['token'],
    routes: [
      {
        path: '/dashboards/token/:token_address',
        component: React.lazy(() => import('./Token')),
      },
    ],
  },
  {
    auth: ['token'],
    routes: [
      {
        path: '/dashboards/token',
        exact: true,
        component: () => <Redirect to={`/dashboards/token/${process.env.REACT_APP_DEFAULT_TOKEN}`} />,
      },
    ],
  }
  // {
  //   auth: ['wizard'],
  //   routes: [
  //     {
  //       path: '/dashboards/wizard/:type?',
  //       component: React.lazy(() => import('./Wizard')),
  //     },
  //   ],
  // },
];
