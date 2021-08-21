import {getType} from 'typesafe-actions';
import {RootAction} from '../store';
import * as actions from '../actions';
import {NavStyle} from 'shared/constants/AppEnums';

export interface SettingState {
  readonly navCollapsed: boolean;
  readonly initialPath: string;
  readonly darkMode: boolean;
  readonly navStyle: NavStyle;
}

const initialSettings: SettingState = {
  navCollapsed: false,
  initialPath: '/',
  darkMode: true,
  navStyle: NavStyle.STANDARD,
};

export default (
  state: SettingState = initialSettings,
  action: RootAction,
): SettingState => {
  switch (action.type) {
    case getType(actions.toggleNavCollapsed):
      return {...state, navCollapsed: !state.navCollapsed};
    case getType(actions.setInitialPath):
      return {...state, initialPath: action.payload};
    case getType(actions.setDarkMode):
      return {...state, darkMode: action.payload};
    case getType(actions.setNavStyle):
      return {...state, navStyle: action.payload};
    default:
      return state;
  }
};
