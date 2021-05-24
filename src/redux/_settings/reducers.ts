import {getType} from 'typesafe-actions';
import {RootAction} from '../store';
import * as actions from '../actions';

export interface SettingState {
  readonly navCollapsed: boolean;
  readonly initialPath: string;
  readonly darkMode: boolean;
}

const initialSettings: SettingState = {
  navCollapsed: false,
  initialPath: '/',
  darkMode: true
};

export default (
  state: SettingState = initialSettings,
  action: RootAction
): SettingState => {
  switch(action.type) {
    case getType(actions.toggleNavCollapsed):
      return {...state, navCollapsed: !state.navCollapsed};
    case getType(actions.setInitialPath):
      return {...state, initialPath: action.payload};
    case getType(actions.setDarkMode):
      return {...state, darkMode: action.payload};
    default:
      return state;
  }
}
 