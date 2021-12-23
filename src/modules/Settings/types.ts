import {LanguageProps} from '@crema/core/LanguageSwitcher/data';

export interface Network {
  chainId: number;
  explorerUrl: string;
  name: string;
  nativeTokenSymbol: string;
  rpcUrl: string;
}

export interface Language extends LanguageProps {}
