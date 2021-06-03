import React from 'react';

export const affiliateConfigs = [
    {
      routes: [
        {
          auth: ['wallet'],
          path: '/affiliate/overview',
          component: React.lazy(() => import('./page/wrapper')),
        },
      ],
    },
  
  ];
  