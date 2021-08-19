import {Token} from 'types/app';
import {createReducer} from '@reduxjs/toolkit';
import {setCollections, addCollection} from './actions';

export interface CollectionItem {
  tokenId: string;
  tokenURI: string;
  description: string;
  name: string;
  imageUrl: string;
}

export interface Collection {
  name: string;
  description: string;
  imageUrl: string;
  address: string;
  abi: any[];
}

export interface WizardState {
  readonly collections: Collection[];
}

const initialState: WizardState = {
  collections: [],
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(setCollections, (state, action) => {
      state.collections = action.payload;
    })
    .addCase(addCollection, (state, action: any) => {
      state.collections.push(action.payload);
    }),
);
