import { ConfigFileAggregator, AggregatorLinks } from 'types/myApps';
import { HelpText } from '../shared';
export const HELP_TEXT: HelpText<ConfigFileAggregator> = {
  'name': ['Enter a name that has not yet been used in other projects as the title of the current project.'],
  'logo': ['Enter the url of your project\'s logo'],
  'logo_dark': ['Enter the url of your project\'s dark logo'],
  'domain': ['Enter your project url'],
  'feeRecipient': ['Enter the wallet that should receive the fee'],
  'affiliateAddress': [],
  'brand_color': [],
  'brand_color_dark': [],
  'bsc_as_default': [],
  'buyTokenPercentage': [],
  'default_token_address': [],
  'default_token_address_bsc': [],
  'default_token_list': [],
  'fee_waive_for_default_token': [],
  'hide_powered_by_dexkit': [],
  'is_dark_mode': ['Check if the colors are from the dark theme'],
  'support_bsc': [],
}

export const HELP_TEXT_LINKS: HelpText<AggregatorLinks> = {
  'about': ['Enter the site content information about the project'],
  'code': ['Url link to project code'],
  'docs': ['Url link to project documentation'],
  'discord': ['Url link to the project channel on the discord platform'],
  'telegram': ['Url link to group on telegram'],
  'analytics':[]
}