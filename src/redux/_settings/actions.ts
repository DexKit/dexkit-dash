import {NavStyle} from 'shared/constants/AppEnums';
import {createAction} from 'typesafe-actions';

export const toggleNavCollapsed = createAction('settings/TOGGLE_NAV_set')();

export const setNavStyle = createAction('settings/NAV_Style_set')<NavStyle>();

export const setInitialPath = createAction(
  'settings/INITIAL_PATH_set',
)<string>();

export const setDarkMode = createAction('settings/DARK_MODE_set')<boolean>();
