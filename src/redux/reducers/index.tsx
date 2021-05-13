import Settings from './Setting';
import Common from './Common';
import FirebaseAuth from './FirebaseAuth';
import Dashboard from './Dashboard';
import blockchain from '../blockchain/reducers';

import Notification from './Notification';
import ConfigFile from './ConfigFile';
import { myAppsReducer } from 'redux/myApps/reducers';

const reducers = {
  settings: Settings,
  auth: FirebaseAuth,
  dashboard: Dashboard,
  common: Common,
  blockchain: blockchain,
  myApps: myAppsReducer,
  notification: Notification,
  configFile: ConfigFile
};

export default reducers;
