import React from 'react';
// import { CustomRedirect } from './CustomRedirect';

export const protocolExplorerConfigs = [
  //   {
  //     routes: [
  //       {
  //         path: '/:networkName/protocol-explorer/:exchange/overview',
  //         component: React.lazy(() => import('./overview')),
  //       },
  //     ],
  //   },
  {
    routes: [
      {
        path: '/protocol-explorer/token-explorer/:address',
        component: React.lazy(() => import('./TokenExplorer/index_tabs')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/protocol-explorer/pool-explorer/:address',
        component: React.lazy(() => import('./PoolExplorer/index_tabs')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/protocol-explorer/pair-explorer/:address',
        component: React.lazy(
          () => import('./GenericPairExplorer/PairExplorer/index_tabs'),
        ),
      },
    ],
  },

  {
    routes: [
      {
        path:
          '/:networkName/protocol-explorer/:exchange/token-explorer/:address',
        component: React.lazy(() => import('./TokenExplorer')),
      },
    ],
  },

  {
    routes: [
      {
        path: '/:networkName/protocol-explorer/:exchange/token-explorer',
        component: React.lazy(() => import('./TokenExplorer')),
      },
    ],
  },

  {
    routes: [
      {
        path:
          '/:networkName/protocol-explorer/:exchange/pool-explorer/:address',
        component: React.lazy(() => import('./PoolExplorer')),
      },
    ],
  },

  {
    routes: [
      {
        path: '/:networkName/protocol-explorer/:exchange/pool-explorer',
        component: React.lazy(() => import('./PoolExplorer')),
      },
    ],
  },

  {
    routes: [
      {
        path:
          '/:networkName/protocol-explorer/:exchange/pair-explorer/:address',
        component: React.lazy(() => import('./GenericPairExplorer')),
        exatch: true,
      },
    ],
  },

  {
    routes: [
      {
        path: '/:networkName/protocol-explorer/:exchange/pair-explorer',
        component: React.lazy(() => import('./GenericPairExplorer')),
      },
    ],
  },
];
