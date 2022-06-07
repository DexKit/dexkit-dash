import React from 'react';
import {Redirect} from 'react-router-dom';

import {createRoutes} from '../@crema/utility/Utils';
import {errorPagesConfigs} from './ErrorPages';

import {dashBoardConfigs} from './Dashboard';

import {coinLeaguesConfigs} from './CoinLeague';
import {changelogConfigs} from './Changelog';
import {myAppsConfigs} from './MyApps';
import {protocolExplorerConfigs} from './ProtocolExplorer';
import {historyConfigs} from './History';
import {affiliateConfigs} from './Affiliate';
import {initialUrl} from '../shared/constants/AppConst';
import {nftWalletConfig} from './NFTWallet';
import {wizardConfig} from './Wizard';
import {onboardingConfig} from './Onboarding';
import {kittygotchiConfig} from './Kittygotchi';
import {profileConfig} from './Profile';

import {squidLeagueConfigs} from './SquidLeague';

import {settingsConfig} from './Settings';
import {nftLeagueConfig} from './NFTLeague';

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
  ...coinLeaguesConfigs,
  ...onboardingConfig,
  ...kittygotchiConfig,
  ...profileConfig,
  ...settingsConfig,
  ...nftLeagueConfig,
  ...squidLeagueConfigs,
];

const routes = [
  ...createRoutes(routeConfigs),
  {path: '/', exact: true, component: () => <Redirect to={initialUrl} />},
  {
    component: () => <Redirect to={`/wallet`} />,
  },
];

export default routes;
