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
    routes: [
      {
        path: '/dashboards/wallet',
        component: React.lazy(() => import('./Wallet')),
      },
    ],
  },
];
