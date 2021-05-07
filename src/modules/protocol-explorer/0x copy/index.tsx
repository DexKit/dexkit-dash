import React from 'react';

export const zrxprotocolConfigs = [
  {

    routes: [
      {
        path: '/protocol-explorer/0x-protocol/overview',
        component: React.lazy(() => import('./Overview')),
      },
    ],
  },
  {

    routes: [
      {
        path: '/protocol-explorer/0x-protocol/tokens',
        component: React.lazy(() => import('./tokens')),
      },
    ],
  },
  {
 
    routes: [
      {
        path: '/protocol-explorer/0x-protocol/trades',
        component: React.lazy(() => import('./trades')),
      },
    ],
  },
  
];
