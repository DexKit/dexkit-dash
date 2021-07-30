import {NavStyle} from 'shared/constants/AppEnums';
import {ChangellyTransaction} from 'types/changelly';
import {createAction} from 'typesafe-actions';

export const SAVE_TRANSACTION = 'SAVE_TRANSACTION';
export const UPDATE_TRANSACTION = 'UPDATE_TRANSACTION';
export const CLEAR_TRANSACTIONS = 'CLEAR_TRANSACTIONS';

export const swapSaveTransaction = (transaction: ChangellyTransaction) => {
  return {type: SAVE_TRANSACTION, transaction};
};

export const swapUpdateTransaction = (transaction: ChangellyTransaction) => {
  return {type: UPDATE_TRANSACTION, transaction};
};

export const swapClearTransactions = () => {
  return {type: CLEAR_TRANSACTIONS};
};
