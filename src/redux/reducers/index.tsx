import Common from '../_common/reducers';
import Settings from '../_settings/reducers';
import Notification from '../_notification/reducers';
import Blockchain from '../_blockchain/reducers';
import MyApps from '../_myapps/reducers';
import UI from '../_ui/reducers';

const reducers = {
  common: Common,
  settings: Settings,
  notification: Notification,
  blockchain: Blockchain,
  myApps: MyApps,
  ui: UI,
};

export default reducers;
