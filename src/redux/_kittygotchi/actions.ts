import {createAction} from '@reduxjs/toolkit';
import {Kittygotchi} from 'types/kittygotchi';

export const setDefaultKitty = createAction<Kittygotchi>(
  'kittygotchi/setDefaultKitty',
);

export const addKittygotchi = createAction<Kittygotchi>(
  'kittygotchi/addKittygotchi',
);

export const setDefaultKittyOnChain = createAction<{
  chainId: number;
  address: string;
  kittygotchi: Kittygotchi;
}>('kittygotchi/setDefaultKittyOnChain');

export const updateImage = createAction<{
  url: string;
  chainId: number;
  address: string;
}>('kittygotchi/updateImage');

export const unsetDefault = createAction<{address: string; chainId: number}>(
  'kittygotchi/unsetDefault',
);

export const clearOldState = createAction('kittygotchi/clearOldState');
