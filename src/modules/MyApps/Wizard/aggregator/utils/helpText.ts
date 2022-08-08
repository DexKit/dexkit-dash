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
  share_image_url: [
    'Image that shows when you share the url from your project',
  ],
  feeRecipient: ['Affiliate address that collects the fee'],
  affiliateAddress: ['Enter the wallet that should receive the fee'],
  brand_color: ["White brand color"],
  brand_color_dark: ["Dark brand color"],
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
  hide_tabs: [
    'Hide aggregator tabs where it says Swap, Limit and Pool',
  ],
  hide_network_selector: [
    'Hide network selector not allowing user to change network',
  ],
  hide_network_dropdown: [
    'Hide network dropdown related to networks',
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
