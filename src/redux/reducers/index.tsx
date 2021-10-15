import Common from '../_common/reducers';
import Settings from '../_settings/reducers';
import Notification from '../_notification/reducers';
import Blockchain from '../_blockchain/reducers';
import MyApps from '../_myapps/reducers';
import UI from '../_ui/reducers';
import Wizard from '../_wizard/reducers';
import Swap from '../_swap/reducers';
import Kittygotchi from '../_kittygotchi/reducers';

const reducers = {
  common: Common,
  settings: Settings,
  notification: Notification,
  blockchain: Blockchain,
  myApps: MyApps,
  wizard: Wizard,
  kittygotchi: Kittygotchi,
  ui: UI,
  swap: Swap,
};

export default reducers;
