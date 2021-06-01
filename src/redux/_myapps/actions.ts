
import { Kit } from 'types/models/Kit';
import { Token } from 'types/app';
import { ConfigResponse } from 'types/myApps';
import { createAction } from 'typesafe-actions';

export const setMyAppsConfigs = createAction('myApps/Configs_set')<ConfigResponse[]>();

export const setUserKits = createAction('myApps/UserKits_set')<Kit[]>();

export const setAllKits = createAction('myApps/AllKits_Set')<Kit[]>();

export const setAllTokens = createAction('myApps/AllTokens_Set')<Token[]>();

export const setInsufficientAmountAlert = createAction('myApps/InsufficientAmountAlert_Set')<boolean>();
