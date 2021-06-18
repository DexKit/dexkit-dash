import {useNetwork} from 'hooks/useNetwork';
import {EXCHANGE, EthereumNetwork} from 'shared/constants/AppEnums';

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
          /* {
            id: 'overview',
            title: 'Overview',
            messageId: 'common.overview',
            type: 'item',
            icon: 'insert_chart',
            url: '/dashboard/overview',
          },*/
          {
            id: 'wallet',
            title: 'Wallet',
            messageId: 'sidebar.app.wallet',
            type: 'item',
            icon: 'account_balance_wallet',
            url: `/dashboard/wallet`,
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
          /* {
            id: 'kit',
            title: 'Kit\'s',
            messageId: 'sidebar.app.kits',
            type: 'item',
            icon: 'build',
            url: '/dashboard/kits',
          },*/
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
            title: 'All Protocols',
            messageId: 'sidebar.protocols.all',
            type: 'collapse',
            icon: 'AllInclusive',
            children: [
              /* {
                id: 'overview',
                title: 'Overview',
                messageId: 'common.overview',
                type: 'item',
                url: `/${networkName}/protocol-explorer/${EXCHANGE.ALL}/overview`,
              },*/
              {
                id: 'tokens',
                title: 'Token Explorer',
                messageId: 'sidebar.protocols.token-explorer',
                type: 'item',
                url: `/${networkName}/protocol-explorer/${EXCHANGE.ALL}/token-explorer/${process.env.REACT_APP_ETH_DEFAULT_TOKEN}`,
              },
              /* {
                id: 'pool-explorer',
                title: 'Pool Explorer',
                messageId: 'sidebar.protocols.pool-explorer',
                type: 'item',
                url: `/${networkName}/protocol-explorer/${EXCHANGE.ALL}/pool-explorer`,
              },*/
              {
                id: 'pair-explorer',
                title: 'Pair Explorer',
                messageId: 'sidebar.protocols.pair-explorer',
                type: 'item',
                url: `/${networkName}/protocol-explorer/${EXCHANGE.ALL}/pair-explorer/${process.env.REACT_APP_ETH_KIT_PAIR}`,
              },
            ],
          },

          {
            id: 'uniswap',
            title: 'Uniswap',
            messageId: 'sidebar.protocols.uniswap',
            type: 'collapse',
            icon: {
              src: 'uniswap.svg',
              type: 'svg',
            },
            children: [
              /*  {
                id: 'overview',
                title: 'Overview',
                messageId: 'common.overview',
                type: 'item',
                url: `/${networkName}/protocol-explorer/${EXCHANGE.UNISWAP}/overview`,
              },*/
              {
                id: 'tokens',
                title: 'Token Explorer',
                messageId: 'sidebar.protocols.token-explorer',
                type: 'item',
                url: `/${networkName}/protocol-explorer/${EXCHANGE.UNISWAP}/token-explorer/${process.env.REACT_APP_ETH_DEFAULT_TOKEN}`,
              },
              {
                id: 'pool-explorer',
                title: 'Pool Explorer',
                messageId: 'sidebar.protocols.pool-explorer',
                type: 'item',
                url: `/${networkName}/protocol-explorer/${EXCHANGE.UNISWAP}/pool-explorer/${process.env.REACT_APP_ETH_DEFAULT_PAIR}`,
              },
              {
                id: 'pair-explorer',
                title: 'Pair Explorer',
                messageId: 'sidebar.protocols.pair-explorer',
                type: 'item',
                url: `/${networkName}/protocol-explorer/${EXCHANGE.UNISWAP}/pair-explorer/${process.env.REACT_APP_ETH_DEFAULT_PAIR}`,
              },
            ],
          },
          {
            id: 'sushiswap',
            title: 'SushiSwap',
            messageId: 'sidebar.protocols.sushiswap',
            type: 'collapse',
            icon: {
              src: 'sushiswap.svg',
              type: 'svg',
            },
            children: [
              /*  {
                id: 'overview',
                title: 'Overview',
                messageId: 'common.overview',
                type: 'item',
                url: `/${networkName}/protocol-explorer/${EXCHANGE.UNISWAP}/overview`,
              },*/
              {
                id: 'tokens',
                title: 'Token Explorer',
                messageId: 'sidebar.protocols.token-explorer',
                type: 'item',
                url: `/${networkName}/protocol-explorer/${EXCHANGE.SUSHISWAP}/token-explorer/${process.env.REACT_APP_DEFAULT_ETH_SUSHI_TOKEN}`,
              },
              {
                id: 'pool-explorer',
                title: 'Pool Explorer',
                messageId: 'sidebar.protocols.pool-explorer',
                type: 'item',
                url: `/${networkName}/protocol-explorer/${EXCHANGE.SUSHISWAP}/pool-explorer/${process.env.REACT_APP_DEFAULT_ETH_SUSHI_PAIR}`,
              },
              {
                id: 'pair-explorer',
                title: 'Pair Explorer',
                messageId: 'sidebar.protocols.pair-explorer',
                type: 'item',
                url: `/${networkName}/protocol-explorer/${EXCHANGE.SUSHISWAP}/pair-explorer/${process.env.REACT_APP_DEFAULT_ETH_SUSHI_PAIR}`,
              },
            ],
          },
          {
            id: 'pancakeswap',
            title: 'PancakeSwap',
            messageId: 'sidebar.protocols.pancakeswap',
            type: 'collapse',
            icon: {
              src: 'pancake.png',
              type: 'png',
            },
            children: [
              /*  {
                id: 'overview',
                title: 'Overview',
                messageId: 'common.overview',
                type: 'item',
                url: `/${networkName}/protocol-explorer/${EXCHANGE.UNISWAP}/overview`,
              },*/
              {
                id: 'tokens',
                title: 'Token Explorer',
                messageId: 'sidebar.protocols.token-explorer',
                type: 'item',
                url: `/bsc/protocol-explorer/${EXCHANGE.PANCAKEV2}/token-explorer/${process.env.REACT_APP_BSC_DEFAULT_TOKEN}`,
              },
              {
                id: 'pool-explorer',
                title: 'Pool Explorer',
                messageId: 'sidebar.protocols.pool-explorer',
                type: 'item',
                url: `/bsc/protocol-explorer/${EXCHANGE.PANCAKEV2}/pool-explorer/${process.env.REACT_APP_BSC_DEFAULT_PAIR}`,
              },
              {
                id: 'pair-explorer',
                title: 'Pair Explorer',
                messageId: 'sidebar.protocols.pair-explorer',
                type: 'item',
                url: `/bsc/protocol-explorer/${EXCHANGE.PANCAKEV2}/pair-explorer/${process.env.REACT_APP_BSC_DEFAULT_PAIR}`,
              },
            ],
          },

          {
            id: '0x-protocol',
            title: '0x Protocol',
            messageId: 'sidebar.protocols.0x',
            type: 'collapse',
            icon: {
              src: '0x.svg',
              type: 'svg',
            },
            children: [
              /* {
                id: 'overview',
                title: 'Overview',
                messageId: 'common.overview',
                type: 'item',
                url: `/${networkName}/protocol-explorer/${EXCHANGE.ZEROX}/overview`,
              },*/
              {
                id: '0x-tokens',
                title: 'Token Explorer',
                messageId: 'sidebar.protocols.token-explorer',
                type: 'item',
                url: `/${networkName}/protocol-explorer/${EXCHANGE.ZEROX}/token-explorer/${process.env.REACT_APP_DEFAULT_ETH_TOKEN_ZRX_PROTOCOL}`,
              },
              {
                id: '0x-pair-explorer',
                title: 'Pair Explorer',
                messageId: 'sidebar.protocols.pair-explorer',
                type: 'item',
                url: `/${networkName}/protocol-explorer/${EXCHANGE.ZEROX}/pair-explorer/${process.env.REACT_APP_DEFAULT_ETH_ZRX_PAIR}`,
              },
            ],
          },
          {
            id: 'balancer',
            title: 'Balancer',
            messageId: 'sidebar.protocols.balancer',
            type: 'collapse',
            icon: {
              src: 'balancer.svg',
              type: 'svg',
            },
            children: [
              /* {
                id: 'overview',
                title: 'Overview',
                messageId: 'common.overview',
                type: 'item',
                url: `/${networkName}/protocol-explorer/${EXCHANGE.ZEROX}/overview`,
              },*/
              {
                id: 'balancer-tokens',
                title: 'Token Explorer',
                messageId: 'sidebar.protocols.token-explorer',
                type: 'item',
                url: `/${networkName}/protocol-explorer/${EXCHANGE.BALANCER}/token-explorer/${process.env.REACT_APP_ETH_DEFAULT_TOKEN}`,
              },
              {
                id: 'balancer-pair-explorer',
                title: 'Pair Explorer',
                messageId: 'sidebar.protocols.pair-explorer',
                type: 'item',
                url: `/${networkName}/protocol-explorer/${EXCHANGE.BALANCER}/pair-explorer/${process.env.REACT_APP_ETH_KIT_PAIR}`,
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
            icon: 'report',
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
}

export default useRoutesConfig;
