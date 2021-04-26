import React from 'react';
import { Redirect } from 'react-router';

export const sushiswapConfigs = [
  {
    routes: [
      {
        path: '/protocol-explorer/sushiswap/overview',
        component: React.lazy(() => import('./overview')),
      },
    ],
  },
  {
 
    routes: [
      {
        path: '/protocol-explorer/sushiswap/token-explorer',
        exact: true,
        // component: React.lazy(() => import('./tokens')),
        component: () => <Redirect to={`/protocol-explorer/sushiswap/token-explorer/${process.env.REACT_APP_DEFAULT_SUSHI_TOKEN}`} />,
      },
    ],
  },
  {
 
    routes: [
      {
        path: '/protocol-explorer/sushiswap/token-explorer/:address',
        component: React.lazy(() => import('./token-explorer')),
      },
    ],
  },
  {

    routes: [
      {
        path: '/protocol-explorer/sushiswap/pair-explorer',
        exact: true,
        // component: React.lazy(() => import('./pair-explorer')),
        component: () => <Redirect to={`/protocol-explorer/sushiswap/pair-explorer/${process.env.REACT_APP_DEFAULT_SUSHI_PAIR}`} />,
      },
    ],
  },
  {
    routes: [
      {
        path: '/protocol-explorer/sushiswap/pair-explorer/:address',
        component: React.lazy(() => import('./pair-explorer')),
      },
    ],
  },
 
  {
    routes: [
      {
        path: '/protocol-explorer/sushiswap/pool-explorer',
        exact: true,
        // component: React.lazy(() => import('./pool-explorer')),
        component: () => <Redirect to={`/protocol-explorer/sushiswap/pool-explorer/${process.env.REACT_APP_DEFAULT_SUSHI_PAIR}`} />,
      },
    ],
  },
  {
    routes: [
      {
        path: '/protocol-explorer/sushiswap/pool-explorer/:address',
        component: React.lazy(() => import('./pool-explorer')),
      },
    ],
  },
 
  
  
];
