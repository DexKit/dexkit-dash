import {createAction} from '@reduxjs/toolkit';
import {Collection, Token} from './reducers';

export const setCollections = createAction<Collection[]>(
  'wizard/setCollections',
);

export const addCollection = createAction<Collection>('wizard/addCollection');
export const addToken = createAction<Token>('wizard/addToken');
export const setTokens = createAction<Token>('wizard/setTokens');
