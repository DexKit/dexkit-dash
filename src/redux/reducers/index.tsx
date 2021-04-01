import Settings from './Setting';
import Common from './Common';
import FirebaseAuth from './FirebaseAuth';
import Dashboard from './Dashboard';
import blockchain from '../blockchain/reducers';
import MyApps from './MyApps';
import Notification from './Notification';
import ConfigFile from './ConfigFile';

const reducers = {
  settings: Settings,
  auth: FirebaseAuth,
  dashboard: Dashboard,
  common: Common,
  blockchain: blockchain,
  myApps: MyApps,
  notification: Notification,
  configFile: ConfigFile
};

export default reducers;
