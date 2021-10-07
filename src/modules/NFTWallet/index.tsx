import React from 'react';

export const nftWalletConfig = [
  {
    routes: [
      // new nfts page on chain.
      {
        path: '/nfts/collections/:network/:address/:token',
        component: React.lazy(() => import('./pages/v2/AssetDetailsPage')),
      },
      {
        path: '/nfts/collections/:network/:address',
        component: React.lazy(() => import('./pages/v2/CollectionDetailsPage')),
      },
      {
        path: '/nfts/assets/:address/:token/sell',
        component: React.lazy(() => import('./pages/Sell')),
      },
      {
        path: '/nfts/assets/:address/:token',
        component: React.lazy(() => import('./pages/Detail')),
      },
      {
        path: '/nfts/wallet/:address',
        component: React.lazy(() => import('./pages/Wallet')),
      },
      // {
      //   path: '/nfts/create-bundle',
      //   component: React.lazy(() => import('./pages/CreateBundle')),
      // },
      // {
      //   path: '/nfts/bundle/:slug',
      //   component: React.lazy(() => import('./pages/BundleDetail')),
      // },
      {
        path: '/nfts/wallet',
        component: React.lazy(() => import('./pages/WalletRedirect')),
      },
    ],
  },
];
