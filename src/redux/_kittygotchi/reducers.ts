import {createReducer} from '@reduxjs/toolkit';
import {Kittygotchi} from 'types/kittygotchi';
import {
  setDefaultKitty,
  setDefaultKittyOnChain,
  updateImage,
  clearOldState,
} from './actions';

export interface KittygotchiState {
  readonly kitties: Kittygotchi[];
  readonly kittygotchiByChain?: {[key: string]: Kittygotchi};
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

      if (!state.kittygotchiByChain) {
        state.kittygotchiByChain = {};
      }

      state.kittygotchiByChain[`${param.address?.toLowerCase()}-${param.chainId}`] =
        param.kittygotchi;
    })
    .addCase(updateImage, (state, action) => {
      let param = action.payload;

      if (state.kittygotchiByChain) {
        if (state.kittygotchiByChain[`${param.address?.toLowerCase()}-${param.chainId}`]) {
          state.kittygotchiByChain[`${param.address?.toLowerCase()}-${param.chainId}`].image =
            param.url;
        }
      }
    })
    .addCase(clearOldState, (state, action) => {
      state.kittygotchi = undefined;
    }),
);
