import EventEmitter from 'events';
import React from 'react';
import {ProviderWrapper, RequestArguments} from './ProviderWrapper';

export interface ProviderWrapperState {
  execute: () => boolean;
  cancel: () => boolean;
  wrapProvider: (provider: any) => ProviderWrapper;
  watch: (cb: (args: RequestArguments) => void) => EventEmitter;
}

export interface GlobalState {
  showTransactionModal: boolean;
  transactionData?: any;
  confirmCallback?: () => void;
  cancelCallback?: () => void;
  toggleTransactionModal(): void;
  setConfirmCallback(cb: () => void): void;
  setCancelCallback(cb: () => void): void;
  setTransactionData(data: any): void;
  reset(): void;
  providerWrapper?: ProviderWrapperState;
}

const defaultGlobalState: GlobalState = {
  showTransactionModal: false,
  toggleTransactionModal: () => {},
  setConfirmCallback: (cb: () => void) => {},
  setCancelCallback: (cb: () => void) => {},
  setTransactionData: (data: any) => {},
  reset: () => {},
};

export const GlobalStateContext =
  React.createContext<GlobalState>(defaultGlobalState);
