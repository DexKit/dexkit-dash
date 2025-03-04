import React from 'react';

export const dashBoardConfigs = [
  {
    routes: [
      {
        path: '/overview',
        component: React.lazy(() => import('./Overview')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/wallet/send',
        component: React.lazy(() => import('./Wallet/pages/ShareSend')),
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
        path: '/favorite-coins',
        component: React.lazy(() => import('./Favorites')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/magic/callback-social',
        component: React.lazy(() => import('./Wallet/pages/MagicCallbackSocial')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/magic/callback',
        component: React.lazy(() => import('./Wallet/pages/MagicCallbackEmail')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/wallet/manage-accounts',
        component: React.lazy(() => import('./Wallet/Accounts')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/wallet/overview/:networkName/:address',
        component: React.lazy(() => import('./Wallet/pages/Overview')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/wallet/:account',
        component: React.lazy(() => import('./Wallet')),
      },
    ],
  },
  {
    auth: ['wallet'],
    routes: [
      {
        path: '/wallet',
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
        path: '/:networkName/token/:address',
        component: React.lazy(() => import('./Token')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/create-wallet',
        component: React.lazy(() => import('./Wallet/CreateWallet')),
      },
    ],
  },
];
