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
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {nftWalletConfig} from './NFTWallet';

const routeConfigs = [
  ...errorPagesConfigs,
  ...dashBoardConfigs,
  ...protocolExplorerConfigs,
  ...myAppsConfigs,
  ...historyConfigs,
  ...affiliateConfigs,
  ...nftWalletConfig,
];

const routes = [
  ...createRoutes(routeConfigs),
  {path: '/', exact: true, component: () => <Redirect to={initialUrl} />},
  {
    component: () => (
      <Redirect
        to={`/${EthereumNetwork.ethereum}/dashboard/token/${process.env.REACT_APP_DEFAULT_ETH_KIT_TOKEN}`}
      />
    ),
  },
];

export default routes;
