export enum ThemeStyle {
  MODERN = 'modern',
  STANDARD = 'standard',
}

export enum ThemeStyleRadius {
  MODERN = 30,
  STANDARD = 4,
}

export enum ThemeMode {
  LIGHT = 'light',
  SEMI_DARK = 'semi-dark',
  DARK = 'dark',
}

export enum LayoutType {
  FULL_WIDTH = 'full-width',
  BOXED = 'boxed',
}

export enum NavStyle {
  DEFAULT = 'default',
  MINI = 'mini',
  STANDARD = 'standard',
  MINI_SIDEBAR_TOGGLE = 'mini-sidebar-toggle',
  HEADER_USER = 'user-header',
  HEADER_USER_MINI = 'user-mini-header',
  DRAWER = 'drawer',
  BIT_BUCKET = 'bit-bucket',
  H_DEFAULT = 'h-default',
  HOR_LIGHT_NAV = 'hor-light-nav',
  HOR_DARK_LAYOUT = 'hor-dark-layout',
}

export enum FooterType {
  FIXED = 'fixed',
  FLUID = 'fluid',
}

export enum HeaderType {
  DARK = 'dark',
  LIGHT = 'light',
}

export enum RouteTransition {
  NONE = 'none',
  FADE = 'fade',
  SLIDE_LEFT = 'slideLeft',
  SLIDE_RIGHT = 'slideRight',
  SLIDE_UP = 'slideUp',
  SLIDE_DOWN = 'slideDown',
}

export enum Fonts {
  LIGHT = 'Gilroy-Light',
  REGULAR = 'Gilroy-Regular',
  MEDIUM = 'Gilroy-Medium',
  BOLD = 'Gilroy-Bold',
  EXTRA_BOLD = 'Gilroy-ExtraBold',
}

export enum CoinIcons {
  BITCOIN_WHITE = 'assets/images/bitcoin.png',
  ETHERIUM = 'assets/images/etherium.png',
  LITECOIN = 'assets/images/litcoin.png',
  RIPPLE = 'assets/images/ripple.png',
}

export enum EthereumNetwork {
  bsc = 'bsc',
  bsc_testnet = 'bsc_testnet',
  celo_alfajores = 'celo_alfajores',
  celo_baklava = 'celo_baklava',
  celo_rc1 = 'celo_rc1',
  ethclassic = 'ethclassic',
  ethclassic_reorg = 'ethclassic_reorg',
  ethereum = 'ethereum',
  goerli = 'goerli',
}

export enum EXCHANGE {
  // ethereum
  UNISWAP = 'Uniswap',
  UNISWAP_V2_BRACKET = '<Uniswap v2>',
  SUSHISWAP = 'SushiSwap',
  ZEROX = 'Zerox Exchange',
  ZEROX_V2 = '<Zerox Exchange v2>',
  ZEROX_V3 = '<Zerox Exchange v3>',
  MATCHA = 'Matcha',
  BAMBOO_RELAY = 'Bamboo Relay',
  CURVE = 'Curve',
  BALANCER = 'Balancer',
  BANCOR_NETWORK = 'Bancor Network',
  KYBER_NETWORK = 'Kyber Network',
  MOONISWAP = 'Mooniswap',
  //bsc
  PANCAKE = 'Pancake',
  PANCAKEV2 = 'Pancake v2',
  ALL = 'all',
}

export enum EXCHANGE_NAME_ON_URL {
  // ethereum
  UNISWAP = 'uniswap',
  SUSHISWAP = 'sushiswap',
  ZEROX = '0x-protocol',
  CURVE = 'curve',
  BALANCER = 'balancer',
  BANCOR_NETWORK = 'bancor-network',
  KYBER_NETWORK = 'kyber-network',
  //bsc
  PANCAKE = 'pancake',
  PANCAKEV2 = 'pancake-v2',
  ALL = 'all',
}

export enum PROTOCOL {
  // ethereum
  UNISWAP_V2 = 'Uniswap v2',
  UNISWAP = 'Uniswap',
  ZEROX_V3 = 'Zerox Exchange v3',
  ZEROX_V2 = 'Zerox Exchange v2',
  ZEROX = 'Zerox Exchange',
  BANCOR_V2 = 'Bancor Network v2',
  CURVE = 'Curve',
  BALANCER = 'Balancer Pool Token',
  MOONISWAP = 'Mooniswap',
  DODO = 'Dodo',
  //bsc
  PANCAKE = 'Pancake',
  ALL = '',
}
