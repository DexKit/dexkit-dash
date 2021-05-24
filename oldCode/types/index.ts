import {CommonActionTypes} from './actions/Common.action';
import {SettingsActionTypes} from './actions/Settings.action';
import {DashboardActionTypes} from './actions/Dashboard.action';
import {UpdateAuthUserActions} from './actions/Auth.actions';
import { MyAppsActions } from './actions/MyApps.actions';
import { NotificationActions } from './actions/Notification.actions';
import { ConfigFileActionTypes } from './actions/ConfigFile.actions';

export type AppActions =
  | CommonActionTypes
  | SettingsActionTypes
  | DashboardActionTypes
  | MyAppsActions
  | UpdateAuthUserActions
  | NotificationActions
  | ConfigFileActionTypes;
