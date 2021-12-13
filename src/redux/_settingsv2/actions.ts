import {createAction} from '@reduxjs/toolkit';

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
}

export const addCustomNetwork = createAction<NetworkParams>(
  'settingsv2/addCustomNetwork',
);

export const updateCustomNetwork = createAction<NetworkParams>(
  'settingsv2/updateCustomNetwork',
);
