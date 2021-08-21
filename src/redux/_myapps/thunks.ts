import {Dispatch} from 'redux';
import {AppActions} from 'types';

import Api from '@crema/services/ApiConfig';
import {BigNumber} from '@0x/utils';
import {fetchStart, fetchSuccess, fetchError} from 'redux/actions';
import {setAllKits, setAllTokens, setUserKits} from './actions';
import {Kit} from 'types/models/Kit';

export const onGetAllKits = () => {
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(fetchStart());
    Api.get('/my-apps/kits')
      .then((data) => {
        if (data.status === 200) {
          dispatch(fetchSuccess());
          dispatch(setAllKits(data.data as Kit[]));
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
          dispatch(setAllTokens(data.data));
        } else {
          dispatch(fetchError('Something went wrong, Please try again!'));
        }
      })
      .catch((error) => {
        dispatch(fetchError(error.message));
      });
  };
};

export const onGetUserKits = (kit_address: string | BigNumber) => {
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(fetchStart());
    Api.get(`/my-apps/kits/${kit_address.toString()}`)
      .then((data) => {
        if (data.status === 200) {
          dispatch(fetchSuccess());
          dispatch(setUserKits(data.data));
        } else {
          dispatch(fetchError('Something went wrong, Please try again!'));
        }
      })
      .catch((error) => {
        dispatch(fetchError(error.message));
      });
  };
};
