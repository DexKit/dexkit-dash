import {createAction} from '@reduxjs/toolkit';
import {Kittygotchi} from 'types/kittygotchi';

export const setDefaultKitty = createAction<Kittygotchi>(
  'kittygotchi/setDefaultKitty',
);

export const addKittygotchi = createAction<Kittygotchi>(
  'kittygotchi/addKittygotchi',
);
