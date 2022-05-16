import {createReducer} from '@reduxjs/toolkit';
import {addTransaction, updateTransaction} from './actions';
import {Transaction} from './types';

export interface TransactionsState {
  transactions?: Transaction[];
}

const initialState: TransactionsState = {};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(addTransaction, (state, action) => {
      if (state.transactions === undefined) {
        state.transactions = [];
      }

      state.transactions?.push(action.payload);
    })
    .addCase(updateTransaction, (state, action) => {
      let {index, transaction} = action.payload;

      if (state.transactions !== undefined) {
        state.transactions[index] = transaction;
      }
    }),
);
