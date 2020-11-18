import Settings from './Setting';
import Common from './Common';
import FirebaseAuth from './FirebaseAuth';
import Dashboard from './Dashboard';
import blockchain from '../blockchain/reducers';

const reducers = {
  settings: Settings,
  auth: FirebaseAuth,
  dashboard: Dashboard,
  common: Common,
  blockchain: blockchain,
};

export default reducers;
