
import { ConfigResponse } from 'types/myApps';
import { createAction } from '@reduxjs/toolkit';
import { Kit } from 'types/models/Kit';
import { Token } from 'types/app';

export const setMyAppsConfigs = createAction<ConfigResponse[]>('myApps/Configs_set');
export const setUserKits = createAction<Kit[]>('myApps/UserKits_set');
export const setAllKits = createAction<Kit[]>('myApps/AllKits_Set');
export const setAllTokens = createAction<Token[]>('myApps/AllTokens_Set');