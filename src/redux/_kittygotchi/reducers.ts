import {createReducer} from '@reduxjs/toolkit';
import {Kittygotchi} from 'types/kittygotchi';
import {
  setDefaultKitty,
  setDefaultKittyOnChain,
  clearOldState,
} from './actions';

export interface KittygotchiState {
  readonly kitties: Kittygotchi[];
  readonly kittygotchiByChain: {[key: string]: Kittygotchi};
  readonly kittygotchi?: Kittygotchi;
}

const initialState: KittygotchiState = {
  kitties: [],
  kittygotchiByChain: {},
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(setDefaultKitty, (state, action) => {
      state.kittygotchi = action.payload;
    })
    .addCase(setDefaultKittyOnChain, (state, action) => {
      let param = action.payload;

      state.kittygotchiByChain[`${param.address}-${param.chainId}`] =
        param.kittygotchi;
    })
    .addCase(clearOldState, (state, action) => {
      state.kittygotchi = undefined;
    }),
);
