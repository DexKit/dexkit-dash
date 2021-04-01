import { Dispatch } from 'redux';
import { AppActions } from 'types';
import { fetchError, fetchStart, fetchSuccess } from './Common';
import Api from '@crema/services/ApiConfig';
import { GET_ALL_KITS, GET_ALL_TOKENS, GET_USER_KITS } from 'types/actions/MyApps.actions';
import { BigNumber } from '@0x/utils';

export const onGetAllKits = () => {
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(fetchStart());
    Api.get('/my-apps/kits')
      .then((data) => {
        if (data.status === 200) {
          dispatch(fetchSuccess());
          dispatch({ type: GET_ALL_KITS, payload: data.data });
        } else {
          dispatch(fetchError('Something went wrong, Please try again!'));
        }
      })
      .catch((error) => {
        dispatch(fetchError(error.message));
      });
  };
};

export const onGetAllTokens = () => {
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(fetchStart());
    Api.get('/my-apps/tokens')
      .then((data) => {
        if (data.status === 200) {
          dispatch(fetchSuccess());
          dispatch({ type: GET_ALL_TOKENS, payload: data.data });
        } else {
          dispatch(fetchError('Something went wrong, Please try again!'));
        }
      })
      .catch((error) => {
        dispatch(fetchError(error.message));
      });
  };
}

export const onGetUserKits = (kit_address: string | BigNumber) => {
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(fetchStart());
    Api.get(`/my-apps/kits/${kit_address.toString()}`)
      .then((data) => {
        if (data.status === 200) {
          dispatch(fetchSuccess());
          dispatch({ type: GET_USER_KITS, payload: data.data });
        } else {
          dispatch(fetchError('Something went wrong, Please try again!'));
        }
      })
      .catch((error) => {
        dispatch(fetchError(error.message));
      });
  };
}