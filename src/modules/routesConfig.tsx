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
}

const useRoutesConfig = (): NavItemProps[] => {
  const networkName = 'ethereum';

  let items: NavItemProps[] = [];

  items = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      messageId: 'sidebar.dashboard',
      type: 'group',
      children: [
        {
          id: 'trade',
          title: 'Trade',
          messageId: 'Trade',
          type: 'item',
          icon: 'compare_arrows',
          url: `/${networkName}/dashboard/token/${process.env.REACT_APP_DEFAULT_ETH_KIT_TOKEN}`,
        },
        {
          id: 'wallet',
          title: 'Wallet',
          messageId: 'sidebar.app.wallet',
          type: 'item',
          icon: 'account_balance_wallet',
          url: `/dashboard/wallet`,
        },
        {
          id: 'create-wallet',
          title: 'Create Wallet',
          messageId: 'Create Wallet',
          type: 'item',
          icon: 'account_balance_wallet',
          url: `/create-wallet`,
        },
        {
          id: 'transaction',
          title: 'Transaction',
          messageId: 'Transaction',
          type: 'item',
          icon: 'swap_horiz',
          url: `/transaction`,
        },
        {
          id: 'favorites',
          title: 'Favorites',
          messageId: 'sidebar.app.favorites',
          type: 'item',
          icon: 'favorite',
          url: `/dashboard/favorite-coins`,
        },
        {
          id: 'nfts',
          title: 'NFT Wallet',
          messageId: 'sidebar.nfts.wallet',
          type: 'item',
          icon: 'storefront',
          url: '/nfts/wallet',
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
          type: 'collapse',
          icon: 'explore',
          children: [
            {
              id: 'tokens',
              title: 'Token Explorer',
              messageId: 'sidebar.protocols.token-explorer',
              type: 'item',
              url: `/protocol-explorer/token-explorer/${process.env.REACT_APP_ETH_DEFAULT_TOKEN}`,
            },

            {
              id: 'pair-explorer',
              title: 'Pair Explorer',
              messageId: 'sidebar.protocols.pair-explorer',
              type: 'item',
              url: `/protocol-explorer/pair-explorer/${process.env.REACT_APP_ETH_KIT_PAIR}`,
            },
            {
              id: 'pool-explorer',
              title: 'Pool Explorer',
              messageId: 'sidebar.protocols.pool-explorer',
              type: 'item',
              url: `/protocol-explorer/pool-explorer/${process.env.REACT_APP_ETH_DEFAULT_PAIR}?protocol=uniswap`,
            },
          ],
        },
      ],
    },
    {
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
          icon: 'apps',
          url: '/my-apps/manage',
        },
      ],
    },
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
          icon: 'groupWork',
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
