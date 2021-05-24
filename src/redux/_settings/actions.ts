import { createAction } from 'typesafe-actions';

export const toggleNavCollapsed = createAction('settings/TOGGLE_NAV_set')();

export const setInitialPath = createAction('settings/INITIAL_PATH_set')<string>();

export const setDarkMode = createAction('settings/DARK_MODE_set')<boolean>();