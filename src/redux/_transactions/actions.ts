import {createAction} from '@reduxjs/toolkit';
import {Transaction} from './types';

export const addTransaction = createAction<Transaction>(
  'transactions/addTransaction',
);

export const updateTransaction = createAction<{
  index: number;
  transaction: Transaction;
}>('transactions/updateTransaction');

export const removeTransaction = createAction<number>(
  'transactions/removeTransaction',
);
