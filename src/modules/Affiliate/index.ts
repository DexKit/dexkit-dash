import React from 'react';

export const affiliateConfigs = [
    {
      routes: [
        {
          path: '/affiliate/overview',
          component: React.lazy(() => import('./page/wrapper')),
        },
      ],
    },
  
  ];
  