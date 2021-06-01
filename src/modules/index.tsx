import React from 'react';
import {Redirect} from 'react-router-dom';

import {createRoutes} from '../@crema/utility/Utils';
import {errorPagesConfigs} from './ErrorPages';

import {dashBoardConfigs} from './Dashboard';
import {myAppsConfigs} from './MyApps';
import {protocolExplorerConfigs} from './ProtocolExplorer';
import {historyConfigs} from './History';
import {affiliateConfigs} from './Affiliate';
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
  {path: '/', exact: true, component: () => <Redirect to={initialUrl} />},
  {component: () => <Redirect to='/dashboard/overview' />},
];

export default routes;
