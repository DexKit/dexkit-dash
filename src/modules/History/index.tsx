import React from 'react';

export const historyConfigs = [
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
        path: '/:networkName/history/transaction/view/:hash',
        component: React.lazy(() => import('./TransactionView')),
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
        path: '/:networkName/history/order/list/:address',
        component: React.lazy(() => import('./TradeHistory')),
      },
    ],
  },

  {
    routes: [
      {
        path: '/:networkName/history/order/list/:address/token/:token',
        component: React.lazy(() => import('./TradeHistory')),
      },
    ],
  },
  {
    routes: [
      {
        path: '/:networkName/history/trade/list/:address/token/:token',
        component: React.lazy(() => import('./TradeHistory')),
      },
    ],
  },

  {
    routes: [
      {
        path: '/:networkName/history/trade/list/:address',
        component: React.lazy(() => import('./TradeHistory')),
      },
    ],
  },

  {
    routes: [
      {
        path: '/:networkName/history/myorders/list/:address',
        component: React.lazy(() => import('./MyOrdersHistory')),
      },
    ],
  },
];
