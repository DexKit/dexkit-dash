import React from 'react';
import { wizardConfigs } from './wizard';

export const myAppsConfigs = [
  {
    auth: ['wallet'],
    routes: [
      {
        path: '/my-apps/manage',
        component: React.lazy(() => import('./manage')),
      }
    ],
  },
  ...wizardConfigs
];
