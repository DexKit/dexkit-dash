import React from 'react';

export const uniswapConfigs = [
  {
 
    routes: [
      {
        path: '/protocol-explorer/uniswap/overview',
        component: React.lazy(() => import('./Overview')),
      },
    ],
  },
  {
 
    routes: [
      {
        path: '/protocol-explorer/uniswap/tokens',
        component: React.lazy(() => import('./tokens')),
      },
    ],
  },
  {

    routes: [
      {
        path: '/protocol-explorer/uniswap/pair-explorer',
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
