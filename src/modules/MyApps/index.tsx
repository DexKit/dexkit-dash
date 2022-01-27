import React from 'react';
import {wizardConfigs} from './Wizard';

export const myAppsConfigs = [
  {
    routes: [
      {
        path: '/my-apps/manage',
        component: React.lazy(() => import('./Manage')),
      },
    ],
  },
  ...wizardConfigs,
];
