import React from 'react';

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
        path: '/onboarding/login-wallet',
        component: React.lazy(() => import('./pages/LoginWallet')),
      },
      {
        path: '/onboarding',
        component: React.lazy(() => import('./pages/index')),
      },
    ],
  },
];
