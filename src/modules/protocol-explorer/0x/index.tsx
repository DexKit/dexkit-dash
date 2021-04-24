import React from 'react';
import { Redirect } from 'react-router';

export const zrxprotocolConfigs = [
  {
 
    routes: [
      {
        path: '/protocol-explorer/0x-protocol/token-explorer',
        exact: true,
        // component: React.lazy(() => import('./tokens')),
        component: () => <Redirect to={`/protocol-explorer/0x-protocol/token-explorer/${process.env.REACT_APP_DEFAULT_TOKEN}`} />,
      },
    ],
  },
  {
 
    routes: [
      {
        path: '/protocol-explorer/0x-protocol/token-explorer/:address',
        component: React.lazy(() => import('./token-explorer')),
      },
    ],
  },
  
];
