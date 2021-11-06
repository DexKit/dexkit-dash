import {Styles} from 'jss';
import {ThemeProperties} from 'types/myApps';
import {HelpText} from '../';
export {DefaultTheme} from './defaultTheme';

export const HELP_TEXT_THEME: HelpText<Partial<ThemeProperties>> = {
  background: ['Enter with the background color of the site'],
  cardBackgroundColor: ['Enter the background color of the card'],
  cardHeaderBackgroundColor: ['Enter the background color of the card header'],
  topbarBackgroundColor: [
    'Enter the background color of the top bar (site header)',
  ],
  inactiveTabBackgroundColor: [
    'Enter the background color of the inactive tab',
  ],
  textInputBackgroundColor: ['Enter the background color of the text input'],
};

export const modalThemeStyle: Styles = {
  content: {
    backgroundColor: '#EFEFEF',
    borderColor: '#CACACA',
    bottom: 'auto',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 0,
    left: 'auto',
    maxHeight: '90%',
    minWidth: '350px',
    overflow: 'hidden',
    padding: '16px',
    position: 'relative',
    right: 'auto',
    top: 'auto',
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    justifyContent: 'center',
    zIndex: 12345,
  },
};

export const lightThemeColors: ThemeProperties = {
  background: '#F9F9F9',
  backgroundERC721: '#F9FAFC',
  borderColor: '#dedede',
  boxShadow: '0 10px 10px rgba(0, 0, 0, 0.1)',
  buttonBuyBackgroundColor: '#3CB34F',
  buttonCollectibleSellBackgroundColor: '#00AE99',
  buttonConvertBackgroundColor: '#fff',
  buttonConvertBorderColor: '#dedede',
  buttonConvertTextColor: '#474747',
  buttonErrorBackgroundColor: '#FF6534',
  buttonPrimaryBackgroundColor: '#002979',
  buttonQuaternaryBackgroundColor: '#00AE99',
  buttonSecondaryBackgroundColor: '#474747',
  buttonSellBackgroundColor: '#FF6534',
  buttonTertiaryBackgroundColor: '#F6851B',
  buttonTextColor: '#EEEEEE',
  buttonPortisBackgroundColor: '#6db2d8',
  buttonFortmaticBackgroundColor: '#1e1c29',
  buttonTorusBackgroundColor: '#3a96ff',
  cardImageBackgroundColor: '#EBF0F5',
  cardBackgroundColor: '#FEFEFE',
  cardHeaderBackgroundColor: '#FEFEFE',
  cardBorderColor: '#DDDDDD',
  cardTitleColor: '#000',
  cardTitleOwnerColor: '#3CB34F',
  cardTitleFontSize: '13px',
  chartColor: '#00AE99',
  darkBlue: '#002979',
  darkGray: '#474747',
  darkerGray: '#666',
  dropdownBackgroundColor: '#fff',
  dropdownBorderColor: '#dedede',
  dropdownTextColor: '#000',
  errorButtonBackground: '#FF6534',
  errorCardBackground: '#FAF4EF',
  errorCardBorder: '#F39E4B',
  errorCardText: '#F68C24',
  ethBoxActiveColor: '#002979',
  ethBoxBorderColor: '#dedede',
  ethSetMinEthButtonBorderColor: '#000',
  ethSliderThumbBorderColor: 'rgba(0, 0, 0, 0.142)',
  ethSliderThumbColor: '#fff',
  gray: '#808080',
  green: '#3CB34F',
  iconLockedColor: '#000',
  iconUnlockedColor: '#C4C4C4',
  inactiveTabBackgroundColor: '#F0F0F0',
  lightGray: '#B9B9B9',
  logoERC20Color: '#0029FF',
  logoERC20TextColor: '#000',
  logoERC721Color: '#00AE99',
  logoERC721TextColor: '#000',
  marketsSearchFieldBackgroundColor: '#eaeaea',
  marketsSearchFieldBorderColor: '#dedede',
  marketsSearchFieldTextColor: '#333',
  modalSearchFieldBackgroundColor: '#fff',
  modalSearchFieldBorderColor: '#fff',
  modalSearchFieldPlaceholderColor: '#DEDEDE',
  modalSearchFieldTextColor: '#000',
  myWalletLinkColor: '#333333',
  notificationActive: '#F8F8F8',
  notificationIconColor: '#474747',
  notificationsBadgeColor: '#ff6534',
  numberDecimalsColor: '#dedede',
  red: '#FF6534',
  rowActive: '#CACACA',
  rowOrderActive: '#dedede',
  simplifiedTextBoxColor: '#F9F9F9',
  stepsProgressCheckMarkColor: '#fff',
  stepsProgressStartingDotColor: '#000',
  stepsProgressStepLineColor: 'rgba(0, 0, 0, 0.1)',
  stepsProgressStepLineProgressColor: '#000',
  stepsProgressStepTitleColor: '#e6e6e6',
  stepsProgressStepTitleColorActive: '#000',
  tableBorderColor: '#dedede',
  tdColor: '#000',
  textColorCommon: '#000000',
  textDark: '#666',
  textInputBackgroundColor: '#F9F9F9',
  textInputBorderColor: '#dedede',
  textInputTextColor: '#000',
  textLight: '#999',
  textLighter: '#666',
  thColor: '#B9B9B9',
  tooltipBackgroundColor: '#222',
  tooltipTextColor: '#fff',
  topbarBackgroundColor: '#fff',
  topbarBorderColor: '#dedede',
  topbarSeparatorColor: '#dedede',
  // ...fontSizes,
  tdFontSize: '',
  thFontSize: '',
};
