import React from 'react';

export const kittygotchiConfig = [
  {
    routes: [
      {
        path: '/kittygotchi/:id/edit',
        component: React.lazy(() => import('./pages/KittyEdit')),
      },
      {
        path: '/kittygotchi/:id',
        component: React.lazy(() => import('./pages/KittyDetail')),
      },
      {
        path: '/kittygotchi',
        component: React.lazy(() => import('./pages/index')),
      },
    ],
  },
];
