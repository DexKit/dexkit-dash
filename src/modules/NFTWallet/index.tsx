import React from 'react';

export const nftWalletConfig = [
  {
    auth: ['wallet'],
    routes: [
      {
        path: '/nfts/assets/:address/:token',
        component: React.lazy(() => import('./AssetDetail')),
      },
      {
        path: '/nfts/wallet/',
        component: React.lazy(() => import('./MyWallet')),
      },
    ],
  },
];
