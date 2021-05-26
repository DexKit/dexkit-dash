import React from 'react';
import {Redirect} from 'react-router-dom';

import {createRoutes} from '../@crema/utility/Utils';
import {errorPagesConfigs} from './errorPages';

import {dashBoardConfigs} from './dashboard';
import {protocolExplorerConfigs} from './protocol-explorer';
import {myAppsConfigs} from './my-apps';
import {affiliateConfigs} from './affiliate';
import {historyConfigs} from './history';
import {initialUrl} from '../shared/constants/AppConst';

const routeConfigs = [
  ...errorPagesConfigs,
  ...dashBoardConfigs,
  ...protocolExplorerConfigs,
  ...myAppsConfigs,
  ...historyConfigs,
  ...affiliateConfigs
];

const routes = [
  ...createRoutes(routeConfigs),
  { path: '/', exact: true, component: () => <Redirect to={initialUrl} />, },
  { component: () => <Redirect to='/dashboard/overview' /> },
];

export default routes;
