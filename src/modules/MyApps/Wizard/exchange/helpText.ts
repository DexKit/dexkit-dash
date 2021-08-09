import {
  GeneralConfig,
  CurrencyPairMetaData,
  ConfigPairMetaData,
} from 'types/myApps';
import {HelpText} from '../shared';
export const HELP_TEXT: HelpText<GeneralConfig> = {
  title: [
    'Enter a name that has not yet been used in other projects as the title of the current project.',
  ],
  icon: ['Enter the url of your project logo'],
  domain: ['Enter your project url'],
  feePercentage: ['Enter the percentage from 0 to 0.5 that you want to charge'],
  feeRecipient: ['Enter the wallet that should receive the fee'],
};

export const HELP_TEXT_PAIR: HelpText<CurrencyPairMetaData> = {
  base: ['Bae pair name'],
  quote: ['Quote pair name'],
};
export const HELP_TEXT_PAIR_CONFIG: HelpText<ConfigPairMetaData> = {
  basePrecision: ['Accuracy in decimal places of the base pair'],
  quotePrecision: ['Accuracy in decimal places of the quote pair'],
  pricePrecision: ['Accuracy in decimal places of the pair price'],
  minAmount: ['Enter the minimal amount to the par'],
  maxAmount: ['Enter the maximum value for the pair'],
};
