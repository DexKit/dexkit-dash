import {Token} from 'types/app';
import {Kit} from 'types/models/Kit';
import {ConfigResponse} from 'types/myApps';
import * as actions from '../actions';
import {RootAction} from '../store';
import {getType} from 'typesafe-actions';

interface MyAppsState {
  configs: ConfigResponse[];
  kitsData: Kit[] | undefined;
  userKits: Kit[] | undefined;
  tokenData: Token[] | undefined;
}

const initialState: MyAppsState = {
  configs: [],
  kitsData: [],
  userKits: [],
  tokenData: [],
};

export default (
  state: MyAppsState = initialState,
  action: RootAction,
): MyAppsState => {
  switch (action.type) {
    case getType(actions.setMyAppsConfigs):
      return {...state, configs: action.payload};
    case getType(actions.setUserKits):
      return {...state, userKits: action.payload};
    case getType(actions.setAllKits):
      return {...state, kitsData: action.payload};
    case getType(actions.setAllTokens):
      return {...state, tokenData: action.payload};
    default:
      return state;
  }
};
