import React from 'react';

export const dashBoardConfigs = [
  {
    routes: [
      {
        path: '/dashboard/overview',
        component: React.lazy(() => import('./Overview')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/swap/coins',
        component: React.lazy(() => import('./Swap')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/dashboard/favorite-coins',
        component: React.lazy(() => import('./Favorites')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/dashboard/wallet/manage-accounts',
        component: React.lazy(() => import('./Wallet/Accounts')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/dashboard/wallet/overview/:networkName/:address',
        component: React.lazy(() => import('./Wallet/pages/Overview')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/dashboard/wallet/:account',
        component: React.lazy(() => import('./Wallet')),
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


  // {
  //   auth: ['wallet'],
  //   routes: [
  //     {
  //       path: '/dashboard/staking',
  //       component: React.lazy(() => import('./Staking')),
  //     },
  //   ],
  // },
  // {
  //   auth: ['wallet'],
  //   routes: [
  //     {
  //       path: '/dashboard/kits',
  //       component: React.lazy(() => import('./Kits')),
  //     },
  //   ],
  // },
  {
    auth: ['token'],
    routes: [
      {
        path: '/:networkName/dashboard/token/:address',
        component: React.lazy(() => import('./Token')),
      },
    ],
  },
];
