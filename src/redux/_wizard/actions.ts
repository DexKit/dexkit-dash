import {createAction} from '@reduxjs/toolkit';
import {Collection} from './reducers';

export const setCollections = createAction<Collection[]>(
  'wizard/setCollections',
);
export const addCollection = createAction<Collection>('wizard/addCollection');
