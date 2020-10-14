import {CommonActionTypes} from './actions/Common.action';
import {SettingsActionTypes} from './actions/Settings.action';
import {DashboardActionTypes} from './actions/Dashboard.action';
import {UpdateAuthUserActions} from './actions/Auth.actions';

export type AppActions =
  | CommonActionTypes
  | SettingsActionTypes
  | DashboardActionTypes
  | UpdateAuthUserActions;
