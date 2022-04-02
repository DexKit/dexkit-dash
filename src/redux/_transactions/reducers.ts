import {createReducer} from '@reduxjs/toolkit';
import {addTransaction} from './actions';
import {Transaction} from './types';

export interface TransactionsState {
  transactions?: Transaction[];
}

const initialState: TransactionsState = {};

export default createReducer(initialState, (builder) =>
  builder.addCase(addTransaction, (state, action) => {}),
);
