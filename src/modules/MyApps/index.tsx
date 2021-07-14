import React from 'react';
import { wizardConfigs } from './Wizard';

export const myAppsConfigs = [
  {
    auth: ['connect-wallet'],
    routes: [
      {
        path: '/my-apps/manage',
        component: React.lazy(() => import('./Manage')),
      }
    ],
  },
  ...wizardConfigs
];
