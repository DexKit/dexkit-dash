import React from 'react';
import {Redirect} from 'react-router-dom';

import {createRoutes} from '../@crema/utility/Utils';
import {errorPagesConfigs} from './ErrorPages';

import {dashBoardConfigs} from './Dashboard';

import {coinLeaguesConfigs} from './CoinLeagues';
import {changelogConfigs} from './Changelog';

import {initialUrl} from '../shared/constants/AppConst';
//import {nftWalletConfig} from './NFTWallet';
//import {wizardConfig} from './Wizard';
import {onboardingConfig} from './Onboarding';

const routeConfigs = [
  ...errorPagesConfigs,
  ...dashBoardConfigs,
 // ...protocolExplorerConfigs,
 // ...myAppsConfigs,
 // ...historyConfigs,
 // ...affiliateConfigs,
 // ...nftWalletConfig,
 // ...wizardConfig,
  ...changelogConfigs,
  ...coinLeaguesConfigs,
  ...onboardingConfig,
 // ...kittygotchiConfig,
 // ...profileConfig,
];

const routes = [
  ...createRoutes(routeConfigs),
  {path: '/', exact: true, component: () => <Redirect to={initialUrl} />},
  {
    component: () => <Redirect to={`/wallet`} />,
  },
];

export default routes;
