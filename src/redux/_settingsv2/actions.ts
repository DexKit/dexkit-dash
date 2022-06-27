import { createAction } from '@reduxjs/toolkit';
import { ChainId } from 'types/blockchain';
import { CustomAsset } from './types';

export interface TokenParams {
  name: string;
  address: string;
  chainId: number;
  symbol: string;
  decimals: number;
}

export const addCustomToken = createAction<TokenParams>(
  'settingsv2/addCustomToken',
);

export interface NetworkParams {
  chainId: number;
  name: string;
  nativeTokenSymbol: string;
  rpcUrl: string;
  explorerUrl?: string;
  networkImg?: string;
}

export const addCustomNetwork = createAction<NetworkParams>(
  'settingsv2/addCustomNetwork',
);

export const updateCustomNetwork = createAction<NetworkParams>(
  'settingsv2/updateCustomNetwork',
);

export const removeCustomNetwork = createAction<NetworkParams>(
  'settingsv2/removeCustomNetwork',
);

export const addCustomAsset = createAction<CustomAsset>(
  'settingsv2/addCustomAsset',
);

export const removeCustomAsset = createAction<CustomAsset>(
  'settingsv2/removeCustomAsset',
);

export const removeCustomToken = createAction<{ address: string, chainId: ChainId }>(
  'settingsv2/removeCustomToken',
);