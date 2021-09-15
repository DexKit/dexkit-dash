import {DeFiSDK} from 'defi-sdk';

export const DefiClient = new DeFiSDK(
  process.env.REACT_APP_DEFI_NODE_URL ?? '',
);
