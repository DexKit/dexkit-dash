import {CommonActionTypes} from './actions/Common.action';
import {SettingsActionTypes} from './actions/Settings.action';
import {NotificationActions} from './actions/Notification.actions';
import {MyAppsActions} from './actions/MyApps.actions';

export type AppActions =
  | CommonActionTypes
  | SettingsActionTypes
  | NotificationActions
  | MyAppsActions
