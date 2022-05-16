import Common from '../_common/reducers';
import Settings from '../_settings/reducers';
import Notification from '../_notification/reducers';
import Blockchain from '../_blockchain/reducers';
import MyApps from '../_myapps/reducers';
import UI from '../_ui/reducers';
import Wizard from '../_wizard/reducers';
import Swap from '../_swap/reducers';
import Kittygotchi from '../_kittygotchi/reducers';
import SettingsV2 from '../_settingsv2/reducers';
import Transactions from '../_transactions/reducers';

const reducers = {
  common: Common,
  settings: Settings,
  settingsv2: SettingsV2,
  notification: Notification,
  blockchain: Blockchain,
  myApps: MyApps,
  wizard: Wizard,
  kittygotchi: Kittygotchi,
  ui: UI,
  swap: Swap,
  transactions: Transactions,
};

export default reducers;
