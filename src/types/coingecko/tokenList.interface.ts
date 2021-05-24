import { BigNumber } from '@0x/utils';

export interface TokenList {
  name: string;
  timestamp: string;
  version: {
    major: number;
    minor: number;
    patch: number;
  };
  keywords: string[];
  tokens: TokenInfo[]
}

export interface TokenInfo {
  address: string;
  chainId: number;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
}

export interface GasInfo {
  gasPriceInWei: BigNumber;
  estimatedTimeMs: number;
}