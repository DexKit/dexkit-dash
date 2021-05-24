import React from 'react';

export const historyConfigs = [
  // {
  //   routes: [
  //     {
  //       path: '/history/order/:type/:address',
  //       component: React.lazy(() => import('./OrderList')),
  //     },
  //   ],
  // },
  
  // {
  //   routes: [
  //     {
  //       path: '/history/transaction/:type/:address',
  //       component: React.lazy(() => import('./TransactionList')),
  //     },
  //   ],
  // },
  
  
  {
    routes: [
      {
        path: '/:networkName/history/order/view/:hash',
        component: React.lazy(() => import('./OrderView')),
      },
    ],
  },
  
  {
    routes: [
      {
        path: '/:networkName/history/transaction/list/:address',
        component: React.lazy(() => import('./TransactionList')),
      },
    ],
  },

  {
    routes: [
      {
        path: '/:networkName/history/transaction/view/:hash',
        component: React.lazy(() => import('./TransactionView')),
      },
    ],
  }
];
