import React from 'react';
import {Redirect} from 'react-router-dom';

import {createRoutes} from '../@crema/utility/Utils';
import {dashBoardConfigs} from './dashboard';
import {errorPagesConfigs} from './errorPages';
import {authRouteConfig} from './auth';
import {blockchainConfigs} from './blockchain';
import {protocolExplorerConfigs} from './protocol-explorer';
import {myAppsConfigs} from './my-apps';
import {initialUrl} from '../shared/constants/AppConst';

const routeConfigs = [
  ...authRouteConfig,
  ...dashBoardConfigs,
  ...errorPagesConfigs,
  ...protocolExplorerConfigs,
  ...blockchainConfigs,
  ...myAppsConfigs,
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
