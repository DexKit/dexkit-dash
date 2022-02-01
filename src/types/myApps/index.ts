import {BigNumber} from '@0x/utils';
import {Styles} from 'jss';

export type WhitelabelTypes = 'DEX' | 'MARKETPLACE' | 'AGGREGATOR';

export interface ConfigResponse {
  slug: string;
  config: string;
  domain: string;
  type: WhitelabelTypes;
  active?: boolean;
}

/**
 * REFATORAR
 */

export interface TokenList {
  name: string;
  timestamp: string;
  version: {
    major: number;
    minor: number;
    patch: number;
  };
  keywords: string[];
  tokens: TokenInfo[];
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

export interface TokenMetaData {
  addresses: {[key: string]: string | undefined};
  symbol: string;
  decimals: number;
  name: string;
  address?: string;
  primaryColor?: string;
  id?: string;
  c_id?: string;
  icon?: string;
  displayDecimals?: number;
  minAmount?: number;
  maxAmount?: number;
  precision?: number;
  description?: string;
  website?: string;
  verisafe_sticker?: string;
  unified_cryptoasset_id?: number;
  mainnetAddress?: string;
  isStableCoin?: boolean;
}

export interface ConfigPairMetaData {
  basePrecision?: number;
  pricePrecision?: number;
  minAmount?: number;
  maxAmount?: number;
  quotePrecision?: number;
}

export interface CurrencyPairMetaData {
  base: string;
  quote: string;
  config?: ConfigPairMetaData;
}

export interface CurrencyPair {
  base: string;
  quote: string;
  config: {
    basePrecision: number;
    pricePrecision: number;
    minAmount: number;
    maxAmount: number;
    quotePrecision: number;
  };
}

export interface CurrencyPairMetaData {
  base: string;
  quote: string;
  config?: {
    basePrecision?: number;
    pricePrecision?: number;
    minAmount?: number;
    maxAmount?: number;
    quotePrecision?: number;
  };
}

export interface Filter {
  text: string;
  value: null | string;
}

interface WalletsConfig {
  metamask: boolean;
  fortmatic: boolean;
  portis: boolean;
  torus: boolean;
}

export interface ThemeProperties {
  background: string;
  backgroundERC721: string;
  borderColor: string;
  boxShadow: string;
  buttonBuyBackgroundColor: string;
  buttonCollectibleSellBackgroundColor: string;
  buttonConvertBackgroundColor: string;
  buttonConvertBorderColor: string;
  buttonConvertTextColor: string;
  buttonErrorBackgroundColor: string;
  buttonPrimaryBackgroundColor: string;
  buttonQuaternaryBackgroundColor: string;
  buttonSecondaryBackgroundColor: string;
  buttonSellBackgroundColor: string;
  buttonTertiaryBackgroundColor: string;
  buttonPortisBackgroundColor: string;
  buttonFortmaticBackgroundColor: string;
  buttonTorusBackgroundColor: string;
  buttonTextColor: string;
  cardImageBackgroundColor: string;
  cardHeaderBackgroundColor: string;
  cardBackgroundColor: string;
  cardBorderColor: string;
  cardTitleColor: string;
  cardTitleOwnerColor: string;
  cardTitleFontSize: string;
  chartColor: string;
  darkBlue: string;
  darkGray: string;
  darkerGray: string;
  dropdownBackgroundColor: string;
  dropdownBorderColor: string;
  dropdownTextColor: string;
  errorButtonBackground: string;
  errorCardBackground: string;
  errorCardBorder: string;
  errorCardText: string;
  ethBoxActiveColor: string;
  ethBoxBorderColor: string;
  ethSetMinEthButtonBorderColor: string;
  ethSliderThumbBorderColor: string;
  ethSliderThumbColor: string;
  gray: string;
  green: string;
  iconLockedColor: string;
  iconUnlockedColor: string;
  inactiveTabBackgroundColor: string;
  lightGray: string;
  logoERC20Color: string;
  logoERC20TextColor: string;
  logoERC721Color: string;
  logoERC721TextColor: string;
  marketsSearchFieldBackgroundColor: string;
  marketsSearchFieldBorderColor: string;
  marketsSearchFieldTextColor: string;
  modalSearchFieldBackgroundColor: string;
  modalSearchFieldBorderColor: string;
  modalSearchFieldPlaceholderColor: string;
  modalSearchFieldTextColor: string;
  myWalletLinkColor: string;
  notificationActive: string;
  notificationIconColor: string;
  notificationsBadgeColor: string;
  numberDecimalsColor: string;
  red: string;
  rowActive: string;
  rowOrderActive: string;
  simplifiedTextBoxColor: string;
  stepsProgressCheckMarkColor: string;
  stepsProgressStartingDotColor: string;
  stepsProgressStepLineColor: string;
  stepsProgressStepLineProgressColor: string;
  stepsProgressStepTitleColor: string;
  stepsProgressStepTitleColorActive: string;
  // font Sizes Marketplace ERC20
  orderbookTDFontSize?: string;
  orderbookTHFontSize?: string;
  marketFillsTHFontSize?: string;
  marketFillsTDFontSize?: string;
  marketListTHFontSize?: string;
  marketListTDFontSize?: string;
  marketStatsTHFontSize?: string;
  marketStatsTDFontSize?: string;
  marketDetailsTHFontSize?: string;
  marketDetailsTDFontSize?: string;
  tableBorderColor: string;
  tdColor: string;
  tdFontSize: string;
  textColorCommon: string;
  textDark: string;
  textInputBackgroundColor: string;
  textInputBorderColor: string;
  textInputTextColor: string;
  textLight: string;
  textLighter: string;
  thColor: string;
  thFontSize: string;
  tooltipBackgroundColor: string;
  tooltipTextColor: string;
  topbarBackgroundColor: string;
  topbarBorderColor: string;
  topbarSeparatorColor: string;
}

export interface PartialTheme {
  componentsTheme?: Partial<ThemeProperties>;
  modalTheme?: Partial<Styles>;
}
export interface SocialNetworks {
  facebook_url?: string;
  reddit_url?: string;
  twitter_url?: string;
  telegram_url?: string;
  discord_url?: string;
  bitcointalk_url?: string;
  youtube_url?: string;
  medium_url?: string;
}

export interface TokenFeeProgramConfig {
  token_address: string;
  token_amount: string;
  buyTokenPercentage: string;
}

export interface AggregatorLinks {
  about?: string;
  code?: string;
  docs?: string;
  discord?: string;
  telegram?: string;
  analytics?: string;
}

export interface AggregatorTheme {
  is_dark_mode: boolean;
  brand_color: string;
  brand_color_dark: string;
}

export interface AggregatorWallet {
  fortmatic?: string;
  portis?: string;
}

type AllValues<T> = {
  [P in keyof T]: {key: P; value: T[P]};
}[keyof T];

export interface GeneralConfigAggregator {
  name: string;
  logo: string;
  logo_dark: string;
  domain: string;
  feeRecipient: string;
  buyTokenPercentage: string;
  brand_color: string;
  brand_color_dark: string;
  is_dark_mode?: boolean;
  support_bsc?: boolean;
  bsc_as_default?: boolean;
  matic_as_default?: boolean;
  avax_as_default?: boolean;
  fantom_as_default?: boolean;
  fee_waive_for_default_token?: boolean;
  hide_powered_by_dexkit?: boolean;
  default_token_list?: string;
  affiliateAddress: string;
  default_token_address?: string;
  default_token_address_bsc?: string;
  default_token_address_matic?: string;
  default_token_address_avax?: string;
  default_token_address_fantom?: string;
  default_slippage?: number;
  buy_token_percentage?: number;
}

export interface ConfigFileAggregator extends GeneralConfigAggregator {
  token_fee_program?: TokenFeeProgramConfig[];
  links?: AggregatorLinks;
  wallets?: AggregatorWallet;
}
export interface GeneralConfig {
  title?: string;
  icon?: string;
  domain?: string;
  feeRecipient?: string;
  feePercentage?: number;
  social?: SocialNetworks;
}

export interface AuthorMarketplace {
  name?: string;
  description?: string;
  image?: string;
  address?: string[];
}

export interface ConfigFileExchange {
  tokens: TokenMetaData[];
  pairs: CurrencyPairMetaData[];
  marketFilters?: Filter[];
  wallets?: WalletsConfig;
  theme_name?: string;
  layout?: string;
  theme?: PartialTheme;
  theme_light?: PartialTheme;
  theme_dark?: PartialTheme;
  general?: GeneralConfig;
}

export interface ConfigFileMarketplace {
  tokens: TokenMetaData[];
  collections: Collection[];
  theme_name?: string;
  layout?: string;
  theme?: PartialTheme;
  theme_light?: PartialTheme;
  theme_dark?: PartialTheme;
  general?: GeneralConfig;
}

export interface Currency {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
  tokenId?: string;
  tokenType?: string;
}

export interface Collection {
  id: string;
  assetCount?: number | null;
  description?: string;
  hidden?: boolean;
  address: string;
  imageUrl: string;
  name: string;
  slug: string;
  symbol?: string;
  type?: string;
}

export type ConfigFile =
  | ConfigFileExchange
  | ConfigFileMarketplace
  | ConfigFileAggregator;
