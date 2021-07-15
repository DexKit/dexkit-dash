import React from 'react';

export const changelogConfigs = [
    {
      routes: [
        {
          path: '/changelog',
          component: React.lazy(() => import('./versions')),
        },
      ],
    },
  
  ];
  