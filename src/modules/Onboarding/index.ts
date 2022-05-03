import React from 'react';
import { LOGIN_WALLET_ROUTE } from 'shared/constants/routes';

export const onboardingConfig = [
  {
    routes: [
      {
        path: '/onboarding/empty-wallet',
        component: React.lazy(() => import('./pages/EmptyWallet')),
      },
      {
        path: '/onboarding/create-wallet',
        component: React.lazy(() => import('./pages/CreateWallet')),
      },
      {
        path: LOGIN_WALLET_ROUTE,
        component: React.lazy(() => import('./pages/LoginWallet')),
      },
      {
        path: '/onboarding',
        component: React.lazy(() => import('./pages/index')),
      },
    ],
  },
];
