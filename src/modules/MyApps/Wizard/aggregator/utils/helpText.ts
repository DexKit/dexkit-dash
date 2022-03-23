import { ConfigFileAggregator, AggregatorLinks } from 'types/myApps';
import { HelpText } from '../../shared';
export const HELP_TEXT: HelpText<ConfigFileAggregator> = {
  name: [
    'Enter a name that has not yet been used in other projects as the title of the current project.',
  ],
  logo: ["Enter the url of your project's logo for use in white mode"],
  logo_dark: ["Enter the url of your project's dark logo for use in dark mode"],
  domain: [
    'Enter your project url that you will be hosting the wordpress plugin',
  ],
  feeRecipient: [],
  affiliateAddress: ['Enter the wallet that should receive the fee'],
  brand_color: [],
  brand_color_dark: [],
  bsc_as_default: ['Bsc as default network on Aggregator'],
  matic_as_default: ['Matic as default network on Aggregator'],
  avax_as_default: ['Avax as default network on Aggregator'],
  fantom_as_default: ['Fantom as default network on Aggregator'],
  buyTokenPercentage: [
    'Percentage you receive as affiliate from trades. From 0 to 5%',
  ],
  default_token_address: ['Default token address on Ethereum'],
  default_token_address_bsc: ['Default token address on Binance Smart Chain'],
  default_token_address_matic: ['Default token address on Matic'],
  default_token_address_avax: ['Default token address on Avax'],
  default_token_address_fantom: ['Default token address on Fantom'],
  default_token_list: ['Default token list on ethereum'],
  fee_waive_for_default_token: [],
  hide_powered_by_dexkit: ["Hide logo of DexKit on app"],
  is_dark_mode: ['Check if the colors are from the dark theme'],
  support_bsc: [],
  default_slippage: [
    'Define initial slippage set on UI, 10 is 0.1%, 100 is 1%, 1000 is 10% etc ',
  ],
};

export const HELP_TEXT_LINKS: HelpText<AggregatorLinks> = {
  about: ['Enter the site content information about the project'],
  code: ['Url link to project code'],
  docs: ['Url link to project documentation'],
  discord: ['Url link to the project channel on the discord platform'],
  telegram: ['Url link to group on telegram'],
  analytics: [],
};
