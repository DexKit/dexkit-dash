import React from 'react';
import { Redirect } from 'react-router';

export const balancerConfigs = [
  {
 
    routes: [
      {
        path: '/protocol-explorer/balancer/token-explorer',
        exact: true,
        // component: React.lazy(() => import('./tokens')),
        component: () => <Redirect to={`/protocol-explorer/balancer/token-explorer/${process.env.REACT_APP_DEFAULT_TOKEN}`} />,
      },
    ],
  },
  {
 
    routes: [
      {
        path: '/protocol-explorer/balancer/token-explorer/:address',
        component: React.lazy(() => import('./token-explorer')),
      },
    ],
  },
  {
 
    routes: [
      {
        path: '/protocol-explorer/balancer/pair-explorer',
        exact: true,
        // component: React.lazy(() => import('./tokens')),
        component: () => <Redirect to={`/protocol-explorer/balancer/pair-explorer/${process.env.REACT_APP_KIT_PAIR}`} />,
      },
    ],
  },
  {
 
    routes: [
      {
        path: '/protocol-explorer/balancer/pair-explorer/:address',
        component: React.lazy(() => import('./pair-explorer')),
      },
    ],
  },
  
];
