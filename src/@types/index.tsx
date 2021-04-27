import { BigNumber } from "@0x/utils";
import { Styles } from "jss";

export interface TokenList{
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

export interface TokenInfo{
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
  addresses: { [key: number]: string };
  symbol: string;
  decimals: number;
  name: string;
  address: string;  
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
  mainnetAddress?: string;
  isStableCoin?: boolean;
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
export interface GeneralConfig {
  title?: string;
  icon?: string;
  domain?: string;
  feeRecipient?: string;
  feePercentage?: number;
  social?: SocialNetworks;
}

export interface ConfigFile {
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

export interface Currency{
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
  assetCount: number | null | undefined;
  description?: string;
  hidden?: boolean;
  address: string;
  imageUrl: string;
  name: string;
  slug: string;
 }



