import React from 'react';
import {Redirect} from 'react-router-dom';

import {createRoutes} from '../@crema/utility/Utils';
import {errorPagesConfigs} from './ErrorPages';

import {dashBoardConfigs} from './Dashboard';

import {coinsLeagueConfigs} from './CoinsLeague';
import {changelogConfigs} from './Changelog';
import {myAppsConfigs} from './MyApps';
import {protocolExplorerConfigs} from './ProtocolExplorer';
import {historyConfigs} from './History';
import {affiliateConfigs} from './Affiliate';
import {initialUrl} from '../shared/constants/AppConst';
import {nftWalletConfig} from './NFTWallet';
import {wizardConfig} from './Wizard';
import {onboardingConfig} from './Onboarding';
import {dropPadConfigs} from './DropPad';
const routeConfigs = [
  ...errorPagesConfigs,
  ...dashBoardConfigs,
  ...protocolExplorerConfigs,
  ...myAppsConfigs,
  ...historyConfigs,
  ...affiliateConfigs,
  ...nftWalletConfig,
  ...wizardConfig,
  ...changelogConfigs,
  ...coinsLeagueConfigs,
  ...onboardingConfig,
  ...dropPadConfigs,
];

const routes = [
  ...createRoutes(routeConfigs),
  {path: '/', exact: true, component: () => <Redirect to={initialUrl} />},
  {
    component: () => <Redirect to={`/wallet`} />,
  },
];

export default routes;
