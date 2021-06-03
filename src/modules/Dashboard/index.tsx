import React from 'react';
import { Redirect } from 'react-router';
import { GET_DEFAULT_BASE } from 'shared/constants/Blockchain';

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
        path: '/:networkName/dashboard/wallet',
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
  }
];
