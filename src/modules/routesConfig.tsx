import {COINLEAGUENFT_ROUTE, COINSLEAGUE_ROUTE} from 'shared/constants/routes';

export interface IconProps {
  src: string;
  type: 'svg' | 'png' | 'jpg';
}

export interface NavItemProps {
  id: string;
  messageId: string;
  title: string;
  icon?: string | IconProps;
  url?: string;
  type?: string;
  count?: number;
  color?: string;
  children?: NavItemProps[] | NavItemProps;
  customIcon?: boolean;
}

const useRoutesConfig = (): NavItemProps[] => {
  let items: NavItemProps[] = [];

  items = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      messageId: 'sidebar.dashboard',
      type: 'group',
      children: [
        {
          id: 'wallet',
          title: 'Wallet',
          messageId: 'sidebar.app.wallet',
          type: 'item',
          customIcon: true,
          icon: 'money.wallet',
          url: `/wallet`,
        },
      /*  {
          id: 'trade',
          title: 'Trade',
          messageId: 'app.trade',
          type: 'item',
          icon: 'bitcoin.convert',
          customIcon: true,
          url: `/trade`,
        },
        {
          id: 'favorites',
          title: 'Favorites',
          messageId: 'sidebar.app.favorites',
          type: 'item',
          customIcon: true,
          icon: 'lovely',
          url: `/favorite-coins`,
        },
        {
          id: 'nfts',
          title: 'NFT Wallet',
          messageId: 'sidebar.nfts.wallet',
          type: 'item',
          customIcon: true,
          icon: 'slider.horizontal',
          url: '/nfts/wallet',
        },
        {
          id: 'wizard',
          title: 'Wizard',
          messageId: 'sidebar.wizard',
          customIcon: true,
          type: 'item',
          icon: 'magicpen',
          url: '/wizard',
        },*/
      ],
    },
  /*  {
      id: 'protocols',
      title: 'Protocol Explorer',
      messageId: 'sidebar.protocols',
      type: 'group',
      children: [
        {
          id: 'all',
          title: 'Explore',
          messageId: 'sidebar.protocols.explore',
          type: 'item',
          customIcon: true,
          icon: 'buy.crypto',
          url: `/explorer/${process.env.REACT_APP_DEFAULT_ETH_KIT_TOKEN}`,
        },
      ],
    },*/
    {
      id: 'coins-league',
      title: 'Coin League',
      messageId: 'sidebar.coin-league',
      type: 'group',
      children: [
        {
          id: 'coinleague-index',
          title: 'Coin League',
          messageId: 'sidebar.coin-league',
          type: 'item',
          customIcon: true,
          icon: 'coinleague',
          url: `${COINSLEAGUE_ROUTE}`,
        },
        {
          id: 'coinleague.nftroom',
          title: 'NFT Room',
          messageId: 'sidebar.app.nft-room',
          type: 'item',
          customIcon: true,
          icon: 'game',
          url: `${COINLEAGUENFT_ROUTE}`,
        },
        {
          id: 'coinleague-discover',
          title: 'Discover Games',
          messageId: 'sidebar.discover-games',
          type: 'item',
          customIcon: true,
          icon: 'gameboy',
          url: `${COINSLEAGUE_ROUTE}/discover-games`,
        },
        {
          id: 'coinleague-mygame',
          title: 'My Games',
          messageId: 'sidebar.my-games',
          type: 'item',
          customIcon: true,
          icon: 'user.search',
          url: `${COINSLEAGUE_ROUTE}/my-games`,
        },
        {
          id: 'coinleague.ranking',
          title: 'Ranking',
          messageId: 'sidebar.ranking',
          type: 'item',
          customIcon: true,
          icon: 'cup',
          url: `${COINSLEAGUE_ROUTE}/ranking`,
        },
        {
          id: 'coinleague.mintnft',
          title: 'Mint NFT',
          messageId: 'sidebar.app.mint-nft',
          type: 'item',
          customIcon: true,
          icon: 'judge',
          url: `${COINSLEAGUE_ROUTE}/champions/event`,
        },
        {
          id: 'howtoplay',
          title: 'How to Play',
          messageId: 'sidebar.app.how-to-play',
          type: 'item',
          customIcon: true,
          icon: 'question',
          url: `${COINSLEAGUE_ROUTE}/how-to-play`,
        },
        {
          id: 'coinleague.affiliate',
          title: 'Coinleague Affiliate',
          messageId: 'sidebar.coinleague.affiliate',
          type: 'item',
          customIcon: true,
          icon: 'user.octagon',
          url: `${COINSLEAGUE_ROUTE}/affiliates`,
        },
        {
          id: 'coinleague.trading-analysis',
          title: 'Trading Analysis',
          messageId: 'sidebar.coinleague.trading-analysis',
          type: 'item',
          customIcon: true,
          icon: 'diagram',
          url: `${COINSLEAGUE_ROUTE}/trading-analysis`,
        },
      ],
    },
    /*{
      id: 'myapps',
      title: 'My Apps',
      messageId: 'sidebar.myapps',
      type: 'group',
      children: [
        {
          id: 'manage-app',
          title: 'Manage',
          messageId: 'sidebar.myapps.manage',
          type: 'item',
          customIcon: true,
          icon: 'element.plus',
          url: '/my-apps/manage',
        },
      ],
    },*/
 /*   {
      id: 'affiliate',
      title: 'Affiliates',
      messageId: 'sidebar.affiliate',
      type: 'group',
      children: [
        {
          id: 'become-affiliate',
          title: 'Become Affiliate',
          messageId: 'sidebar.affiliate.become-affiliate',
          type: 'item',
          customIcon: true,
          icon: 'user.octagon',
          url: '/affiliate/overview',
        },
      ],
    },*/
    {
      id: 'settings',
      title: 'Settings',
      messageId: 'sidebar.settings',
      type: 'group',
      children: [
        {
          id: 'settings-general',
          title: 'General',
          messageId: 'sidebar.settings.general',
          type: 'item',
          customIcon: true,
          icon: 'settings',
          url: '/settings',
        },
      ],
    },
    {
      id: 'apps',
      title: 'Apps',
      messageId: 'sidebar.externallinks',
      type: 'group',
      children: [
        {
          id: 'leagues-website',
          title: 'CoinLeague Website',
          messageId: 'sidebar.app.coinleague-website',
          type: 'external',
          customIcon: true,
          icon: 'coinleague',
          url: `https://coinleagues.games`,
        },
      /* {
          id: 'dashboard',
          title: 'DexKit Dashboard',
          messageId: 'sidebar.app.dexkit-dash',
          type: 'external',
          customIcon: true,
          icon: 'dexkit',
          url: 'https://app.dexkit.com',
        },*/
        /* {
          id: 'marketplace',
          title: 'Marketplace',
          messageId: 'sidebar.app.marketplace',
          type: 'external',
          icon: 'storefront',
          url: 'https://demo.nft.dexkit.com',
        },
        {
          id: 'farming',
          title: 'Farming',
          messageId: 'sidebar.app.farming',
          type: 'external',
          icon: 'fastfood',
          url: 'https://farm.dexkit.com',
        },*/
      ],
    },
  ];

  return items;
};

export default useRoutesConfig;
