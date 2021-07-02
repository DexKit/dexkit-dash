import React from 'react';

export const nftWalletConfig = [
  {
    routes: [
      {
        path: '/nfts/assets/:address/:token/sell',
        component: React.lazy(() => import('./Sell')),
      },
      {
        path: '/nfts/assets/:address/:token',
        component: React.lazy(() => import('./AssetDetail')),
      },
      {
        path: '/nfts/wallet/:address',
        component: React.lazy(() => import('./Wallet')),
      },
      {
        path: '/nfts/wallet',
        component: React.lazy(() => import('./WalletRedirect')),
      },
    ],
  },
];
