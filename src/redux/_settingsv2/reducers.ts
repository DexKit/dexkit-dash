import { createReducer } from '@reduxjs/toolkit';
import { isAddressEqual } from 'utils/blockchain';

import {
  addCustomToken,
  addCustomNetwork,
  updateCustomNetwork,
  addCustomAsset,
  removeCustomAsset,
  removeCustomNetwork,
  removeCustomToken,
} from './actions';

export interface SettingsV2State {
  readonly tokens: any[];
  readonly networks: any[];
  readonly assets: any[];
}

const initialState: SettingsV2State = {
  tokens: [],
  networks: [],
  assets: [],
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
      } else {
        state.networks[index] = action.payload;
      }
    })
    .addCase(updateCustomNetwork, (state, action) => {
      const index = state.networks.findIndex(
        (n) => n.chainId === action.payload.chainId,
      );

      if (index !== -1) {
        state.networks[index] = action.payload;
      }
    })
    .addCase(addCustomAsset, (state, action) => {
      if (state.assets) {
        const assets = state.assets.filter(
          (asset) => action.payload.chainId === asset.chainId,
        );

        const index = assets.findIndex((asset: any) => {
          return (
            asset.tokenId === action.payload.tokenId &&
            asset.contractAddress === action.payload.contractAddress
          );
        });

        if (index === -1) {
          state.assets = [...state.assets, action.payload];
        }
      } else {
        state.assets = [action.payload];
      }
    })
    .addCase(removeCustomAsset, (state, action) => {
      const index = state.assets.findIndex((asset: any) => {
        return (
          asset.tokenId === action.payload.tokenId &&
          asset.contractAddress === action.payload.contractAddress
        );
      });

      if (index > -1) {
        const assets = state.assets;

        assets.splice(index, 1);

        state.assets = [...assets];
      }
    })
    .addCase(removeCustomNetwork, (state, action) => {
      const index = state.networks.findIndex(
        (network: any) => network.chainId === action.payload.chainId,
      );

      if (index > -1) {
        const networks = state.networks;

        networks.splice(index, 1);

        state.networks = [...networks];
      }
    }).addCase(removeCustomToken, (state, action) => {
      const index = state.tokens.findIndex(
        (token: any) => token.chainId === action.payload.chainId && token.address === action.payload.address,
      );

      if (index > -1) {
        const tokens = state.tokens;

        tokens.splice(index, 1);

        state.tokens = [...tokens];
      }
    }),
);
