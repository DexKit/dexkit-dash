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
        {
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
        },
      ],
    },
    {
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
    },
    {
      id: 'coins-league',
      title: 'Coin League',
      messageId: 'sidebar.coin-league',
      type: 'group',
      children: [
        {
          id: 'coinleague.index',
          title: 'Coin League',
          messageId: 'sidebar.coin-league',
          type: 'item',
          customIcon: true,
          icon: 'coinleague',
          url: `/coin-league`,
        },
        {
          id: 'discover-games',
          title: 'Discover Games',
          messageId: 'sidebar.discover-games',
          type: 'item',
          customIcon: true,
          icon: 'gameboy',
          url: `/coin-league/discover-games`,
        },
        {
          id: 'my-games',
          title: 'My Games',
          messageId: 'sidebar.my-games',
          type: 'item',
          customIcon: true,
          icon: 'user.search',
          url: `/coin-league/my-games`,
        },
        {
          id: 'coinleague.ranking',
          title: 'Ranking',
          messageId: 'sidebar.ranking',
          type: 'item',
          customIcon: true,
          icon: 'cup',
          url: `/coin-league/ranking`,
        },
        {
          id: 'coinleague.nftroom',
          title: 'NFT Room',
          messageId: 'sidebar.app.nft-room',
          type: 'item',
          customIcon: true,
          icon: 'game',
          url: `/coin-league/nft-room`,
        },
        {
          id: 'coinleague.mintnft',
          title: 'Mint NFT',
          messageId: 'sidebar.app.mint-nft',
          type: 'item',
          customIcon: true,
          icon: 'judge',
          url: `/coin-league/champions/event`,
        },
        {
          id: 'coinleague.how-to-play',
          title: 'How To Play',
          messageId: 'sidebar.howToPlay',
          type: 'item',
          customIcon: true,
          icon: 'question',
          url: `/coin-league/how-to-play`,
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
    {
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
    },
    {
      id: 'apps',
      title: 'Apps',
      messageId: 'sidebar.externallinks',
      type: 'group',
      children: [
        {
          id: 'exchange',
          title: 'Exchange',
          messageId: 'sidebar.app.exchange',
          type: 'external',
          icon: 'show_chart',
          url: 'https://exchange.dexkit.com',
        },
        {
          id: 'swap',
          title: 'Swap',
          messageId: 'sidebar.app.swap',
          type: 'external',
          icon: 'swap_horiz',
          url: 'https://swap.dexkit.com/#/swap',
        },
        {
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
        },
      ],
    },
  ];

  return items;
};

export default useRoutesConfig;
