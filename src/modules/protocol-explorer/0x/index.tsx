import React from 'react';
import { Redirect } from 'react-router';

export const zrxprotocolConfigs = [
  {
 
    routes: [
      {
        path: '/protocol-explorer/0x-protocol/token-explorer',
        exact: true,
        // component: React.lazy(() => import('./tokens')),
        component: () => <Redirect to={`/protocol-explorer/0x-protocol/token-explorer/${process.env.REACT_APP_DEFAULT_TOKEN_ZRX_PROTOCOL}`} />,
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
  {
 
    routes: [
      {
        path: '/protocol-explorer/0x-protocol/pair-explorer',
        exact: true,
        // component: React.lazy(() => import('./tokens')),
        component: () => <Redirect to={`/protocol-explorer/0x-protocol/pair-explorer/${process.env.REACT_APP_DEFAULT_ZRX_PAIR}`} />,
      },
    ],
  },
  {
 
    routes: [
      {
        path: '/protocol-explorer/0x-protocol/pair-explorer/:address',
        component: React.lazy(() => import('./pair-explorer')),
      },
    ],
  },
  
];
