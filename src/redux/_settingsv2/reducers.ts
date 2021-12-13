import {createReducer} from '@reduxjs/toolkit';
import {isAddressEqual} from 'utils/blockchain';

import {addCustomToken, addCustomNetwork, updateCustomNetwork} from './actions';

export interface SettingsV2State {
  readonly tokens: any[];
  readonly networks: any[];
}

const initialState: SettingsV2State = {
  tokens: [],
  networks: [],
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(addCustomToken, (state, action) => {
      const index = state.tokens.findIndex(
        (t) =>
          t.chainId === action.payload.chainId &&
          isAddressEqual(t.address, action.payload.address),
      );

      if (index === -1) {
        const tokensCopy = [...state.tokens, action.payload];

        state.tokens = tokensCopy;
      }
    })
    .addCase(addCustomNetwork, (state, action) => {
      const index = state.networks.findIndex(
        (n) => n.chainId === action.payload.chainId,
      );

      if (index === -1) {
        state.networks = [...state.networks, action.payload];
      }
    })
    .addCase(updateCustomNetwork, (state, action) => {
      const index = state.networks.findIndex(
        (n) => n.chainId === action.payload.chainId,
      );

      if (index !== -1) {
        state.networks[index] = action.payload;
      }
    }),
);
