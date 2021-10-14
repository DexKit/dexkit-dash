import {createReducer} from '@reduxjs/toolkit';
import {Kittygotchi} from 'types/kittygotchi';
import {setDefaultKitty} from './actions';

export interface KittygotchiState {
  readonly kitties: Kittygotchi[];
  readonly kittygotchi?: Kittygotchi;
}

const initialState: KittygotchiState = {
  kitties: [],
};

export default createReducer(initialState, (builder) =>
  builder.addCase(setDefaultKitty, (state, action) => {
    state.kittygotchi = action.payload;
  }),
);
