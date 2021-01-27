import React from 'react';

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
        path: '/dashboards/token',
        component: React.lazy(() => import('./Token')),
      },
    ],
  },
];
