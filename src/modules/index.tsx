import React from 'react';
import {Redirect} from 'react-router-dom';

import {createRoutes} from '../@crema/utility/Utils';
import {errorPagesConfigs} from './errorPages';

import {authRouteConfig} from './auth';
import {dashBoardConfigs} from './dashboard';
import {protocolExplorerConfigs} from './protocol-explorer';
import {myAppsConfigs} from './my-apps';
// import { historyConfigs } from './history';
import {initialUrl} from '../shared/constants/AppConst';

const routeConfigs = [
  ...errorPagesConfigs,
  ...authRouteConfig,
  ...dashBoardConfigs,
  ...protocolExplorerConfigs,
  ...myAppsConfigs,
  // ...historyConfigs
];

const routes = [
  ...createRoutes(routeConfigs),
  {
    path: '/',
    exact: true,
    component: () => <Redirect to={initialUrl} />,
  },
  {
    component: () => <Redirect to='/error-pages/error-404' />,
  },
];

export default routes;
