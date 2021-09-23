import {createReducer} from '@reduxjs/toolkit';
import {setCollections, addCollection, addToken, setTokens} from './actions';

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

export interface Token {
  name: string;
  symbol: string;
  supply: number;
}

export interface WizardState {
  readonly collections: Collection[];
  readonly tokens: Token[];
}

const initialState: WizardState = {
  collections: [],
  tokens: [],
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(setCollections, (state, action) => {
      state.collections = action.payload;
    })
    .addCase(addCollection, (state, action: any) => {
      if (state.collections) {
        state.collections.push(action.payload);
      } else {
        state.collections = [];
        state.collections.push(action.payload);
      }
    })
    .addCase(addToken, (state, action: any) => {
      if (state.tokens) {
        state.tokens.push(action.payload);
      } else {
        state.tokens = [];
        state.tokens.push(action.payload);
      }
    })
    .addCase(setTokens, (state, action: any) => {
      state.tokens = action.payload;
    }),
);
