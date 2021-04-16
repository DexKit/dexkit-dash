import React from 'react';
import { Redirect } from 'react-router';

export const uniswapConfigs = [
  {
    routes: [
      {
        path: '/protocol-explorer/uniswap/overview',
        component: React.lazy(() => import('./overview')),
      },
    ],
  },
  {
 
    routes: [
      {
        path: '/protocol-explorer/uniswap/token-explorer',
        exact: true,
        // component: React.lazy(() => import('./tokens')),
        component: () => <Redirect to={`/protocol-explorer/uniswap/token-explorer/${process.env.REACT_APP_DEFAULT_TOKEN}`} />,
      },
    ],
  },
  {
 
    routes: [
      {
        path: '/protocol-explorer/uniswap/token-explorer/:address',
        component: React.lazy(() => import('./token-explorer')),
      },
    ],
  },
  {

    routes: [
      {
        path: '/protocol-explorer/uniswap/pair-explorer',
        exact: true,
        // component: React.lazy(() => import('./pair-explorer')),
        component: () => <Redirect to={`/protocol-explorer/uniswap/pair-explorer/${process.env.REACT_APP_DEFAULT_PAIR}`} />,
      },
    ],
  },
  {

    routes: [
      {
        path: '/protocol-explorer/uniswap/pair-explorer/:address',
        component: React.lazy(() => import('./pair-explorer')),
      },
    ],
  },
  {
 
    routes: [
      {
        path: '/protocol-explorer/uniswap/pool-explorer',
        component: React.lazy(() => import('./pool-explorer')),
      },
    ],
  },
 
  
  
];
