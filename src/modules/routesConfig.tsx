import { useNetwork } from "hooks/useNetwork";
import { EXCHANGE, NETWORK } from "shared/constants/AppEnums";

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

const useRoutesConfig = (): NavItemProps[]  => {

  const networkName = useNetwork();

  let items: NavItemProps[] = [];

  if (networkName == NETWORK.ETHEREUM) {
    items = [
      {
        id: 'dashboard',
        title: 'Dashboard',
        messageId: 'sidebar.dashboard',
        type: 'group',
        children: [
          {
            id: 'overview',
            title: 'Overview',
            messageId: 'common.overview',
            type: 'item',
            icon: 'insert_chart',
            url: '/dashboard/overview',
          },
          {
            id: 'wallet',
            title: 'Wallet',
            messageId: 'sidebar.app.wallet',
            type: 'item',
            icon: 'account_balance_wallet',
            url: '/dashboard/wallet',
          },
          {
            id: 'token',
            title: 'Token',
            messageId: 'Token',
            type: 'item',
            icon: 'storage',
            url: `/dashboard/token/${process.env.REACT_APP_ETH_DEFAULT_TOKEN}`,
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
            icon: 'all inclusive',
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
                url: `/${networkName}/protocol-explorer/${EXCHANGE.ALL}/token-explorer`,
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
                url: `/${networkName}/protocol-explorer/${EXCHANGE.ALL}/pair-explorer`,
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
              type: 'svg'
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
              type: 'svg'
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
            id: '0x-protocol',
            title: '0x Protocol',
            messageId: 'sidebar.protocols.0x',
            type: 'collapse',
            icon: {
              src: '0x.svg',
              type: 'svg'
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
              type: 'svg'
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
          /*
          {
            id: 'nft-marketplace',
            title: 'Marketplace',
            messageId: 'sidebar.affiliate.nft-marketplace',
            type: 'collapse',
            icon: 'store_mall_directory',
            children: [
              {
                id: 'nft-marketplace-overview',
                title: 'Overview',
                messageId: 'common.overview',
                type: 'item',
                url: '/affiliate/nft-marketplace/overview',
              },
            ],
          },
          {
            id: 'erc20-exchange',
            title: 'Exchange',
            messageId: 'sidebar.affiliate.erc20-exchange',
            type: 'collapse',
            icon: 'timeline',
            children: [
              {
                id: 'erc20-exchange-overview',
                title: 'Overview',
                messageId: 'common.overview',
                type: 'item',
                url: '/affiliate/nft-marketplace/overview',
              },
            ],
          },*/
        ],
      },
      /* {
         id: 'affiliate',
         title: 'Affiliates',
         messageId: 'sidebar.affiliate',
         type: 'group',
         children: [
           {
             id: 'aggregator',
             title: 'Aggregator',
             messageId: 'sidebar.affiliate.aggregator',
             type: 'collapse',
             icon: 'report',
             children: [
               {
                 id: 'agg-overview',
                 title: 'Overview',
                 messageId: 'common.overview',
                 type: 'item',
                 url: '/affiliate/aggregator/overview',
               },
             ],
           },
           {
             id: 'nft-marketplace',
             title: 'Marketplace',
             messageId: 'sidebar.affiliate.nft-marketplace',
             type: 'collapse',
             icon: 'store_mall_directory',
             children: [
               {
                 id: 'nft-marketplace-overview',
                 title: 'Overview',
                 messageId: 'common.overview',
                 type: 'item',
                 url: '/affiliate/nft-marketplace/overview',
               },
             ],
           },
           {
             id: 'erc20-exchange',
             title: 'Exchange',
             messageId: 'sidebar.affiliate.erc20-exchange',
             type: 'collapse',
             icon: 'timeline',
             children: [
               {
                 id: 'erc20-exchange-overview',
                 title: 'Overview',
                 messageId: 'common.overview',
                 type: 'item',
                 url: '/affiliate/nft-marketplace/overview',
               },
             ],
           },
         ],
       },*/
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
            url: 'https://swap.dexkit.com/#/swap',
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
            url: 'https://swap.dexkit.com/#/swap',
          },
          {
            id: 'farming',
            title: 'Farming',
            messageId: 'sidebar.app.farming',
            type: 'external',
            icon: 'fastfood',
            url: 'https://swap.dexkit.com/#/swap',
          },
        ],
      },
    ];
  }
  else {
    items = [
      {
        id: 'dashboard',
        title: 'Dashboard',
        messageId: 'sidebar.dashboard',
        type: 'group',
        children: [
          {
            id: 'overview',
            title: 'Overview',
            messageId: 'common.overview',
            type: 'item',
            icon: 'insert_chart',
            url: '/dashboard/overview',
          },
          {
            id: 'wallet',
            title: 'Wallet',
            messageId: 'sidebar.app.wallet',
            type: 'item',
            icon: 'account_balance_wallet',
            url: '/dashboard/wallet',
          },
          {
            id: 'token',
            title: 'Token',
            messageId: 'Token',
            type: 'item',
            icon: 'storage',
            url: '/dashboard/token',
          },
  
          {
            id: 'kit',
            title: 'Kit\'s',
            messageId: 'sidebar.app.kits',
            type: 'item',
            icon: 'build',
            url: '/dashboard/kits',
          },
        ],
      },
      // {
      //   id: 'app',
      //   title: 'Application',
      //   messageId: 'sidebar.application',
      //   type: 'group',
      //   children: [
      //     {
      //       id: 'dashboards',
      //       title: 'Dashboards',
      //       messageId: 'sidebar.app.dashboard',
      //       type: 'collapse',
      //       icon: 'dashboard',
      //       children: [
      //         {
      //           id: 'analytics',
      //           title: 'Analytics',
      //           messageId: 'sidebar.app.dashboard.analytics',
      //           type: 'item',
      //           url: '/dashboards/analytics',
      //         },
      //         {
      //           id: 'crm',
      //           title: 'CRM',
      //           messageId: 'sidebar.app.dashboard.crm',
      //           type: 'item',
      //           url: '/dashboards/crm',
      //         },
      //         {
      //           id: 'crypto',
      //           title: 'Crypto',
      //           messageId: 'sidebar.app.dashboard.crypto',
      //           type: 'item',
      //           url: '/dashboards/crypto',
      //         },
      //       ],
      //     },
      //     {
      //       id: 'metrics',
      //       title: 'Metrics',
      //       messageId: 'sidebar.app.metrics',
      //       type: 'item',
      //       icon: 'insert_chart',
      //       url: '/dashboards/metrics',
      //     },
      //     {
      //       id: 'widgets',
      //       title: 'Widgets',
      //       messageId: 'sidebar.app.widgets',
      //       type: 'item',
      //       icon: 'widgets',
      //       url: '/dashboards/widgets',
      //     },
      //   ],
      // },
      // {
      //   id: 'pages',
      //   title: 'Pages',
      //   messageId: 'sidebar.pages',
      //   type: 'group',
      //   children: [
      //     {
      //       id: 'error-pages',
      //       title: 'Error Pages',
      //       messageId: 'sidebar.pages.errorPages',
      //       type: 'collapse',
      //       icon: 'report',
      //       children: [
      //         {
      //           id: 'error-404',
      //           title: '404',
      //           messageId: 'sidebar.pages.errorPages.404',
      //           type: 'item',
      //           url: '/error-pages/error-404',
      //         },
      //         {
      //           id: 'error-500',
      //           title: '500',
      //           messageId: 'sidebar.pages.errorPages.500',
      //           type: 'item',
      //           url: '/error-pages/error-500',
      //         },
      //         {
      //           id: 'maintenance',
      //           title: 'Maintenance',
      //           messageId: 'sidebar.pages.errorPages.maintenance',
      //           type: 'item',
      //           url: '/error-pages/maintenance',
      //         },
      //         {
      //           id: 'coming-soon',
      //           title: 'Coming Soon',
      //           messageId: 'sidebar.pages.errorPages.comingSoon',
      //           type: 'item',
      //           url: '/error-pages/coming-soon',
      //         },
      //       ],
      //     },
      //   ],
      // },
      {
        id: 'protocols',
        title: 'Protocol Explorer',
        messageId: 'sidebar.protocols',
        type: 'group',
        children: [
          {
            id: 'pancake',
            title: 'Pancake',
            messageId: 'sidebar.protocols.pancake',
            type: 'collapse',
            icon: {
              src: 'uniswap.svg',
              type: 'svg'
            },
            children: [
              {
                id: 'overview',
                title: 'Overview',
                messageId: 'common.overview',
                type: 'item',
                url: `/${networkName}/protocol-explorer/pancake/overview`,
              },
              {
                id: 'tokens',
                title: 'Token Explorer',
                messageId: 'sidebar.protocols.token-explorer',
                type: 'item',
                url: `/${networkName}/protocol-explorer/pancake/token-explorer`,
              },
              {
                id: 'pool-explorer',
                title: 'Pool Explorer',
                messageId: 'sidebar.protocols.pool-explorer',
                type: 'item',
                url: `/${networkName}/protocol-explorer/pancake/pool-explorer`,
              },
              {
                id: 'pair-explorer',
                title: 'Pair Explorer',
                messageId: 'sidebar.protocols.pair-explorer',
                type: 'item',
                url: `/${networkName}/protocol-explorer/pancake/pair-explorer`,
              },
            ],
          }
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
          /*
          {
            id: 'nft-marketplace',
            title: 'Marketplace',
            messageId: 'sidebar.affiliate.nft-marketplace',
            type: 'collapse',
            icon: 'store_mall_directory',
            children: [
              {
                id: 'nft-marketplace-overview',
                title: 'Overview',
                messageId: 'common.overview',
                type: 'item',
                url: '/affiliate/nft-marketplace/overview',
              },
            ],
          },
          {
            id: 'erc20-exchange',
            title: 'Exchange',
            messageId: 'sidebar.affiliate.erc20-exchange',
            type: 'collapse',
            icon: 'timeline',
            children: [
              {
                id: 'erc20-exchange-overview',
                title: 'Overview',
                messageId: 'common.overview',
                type: 'item',
                url: '/affiliate/nft-marketplace/overview',
              },
            ],
          },*/
        ],
      },
      /* {
         id: 'affiliate',
         title: 'Affiliates',
         messageId: 'sidebar.affiliate',
         type: 'group',
         children: [
           {
             id: 'aggregator',
             title: 'Aggregator',
             messageId: 'sidebar.affiliate.aggregator',
             type: 'collapse',
             icon: 'report',
             children: [
               {
                 id: 'agg-overview',
                 title: 'Overview',
                 messageId: 'common.overview',
                 type: 'item',
                 url: '/affiliate/aggregator/overview',
               },
             ],
           },
           {
             id: 'nft-marketplace',
             title: 'Marketplace',
             messageId: 'sidebar.affiliate.nft-marketplace',
             type: 'collapse',
             icon: 'store_mall_directory',
             children: [
               {
                 id: 'nft-marketplace-overview',
                 title: 'Overview',
                 messageId: 'common.overview',
                 type: 'item',
                 url: '/affiliate/nft-marketplace/overview',
               },
             ],
           },
           {
             id: 'erc20-exchange',
             title: 'Exchange',
             messageId: 'sidebar.affiliate.erc20-exchange',
             type: 'collapse',
             icon: 'timeline',
             children: [
               {
                 id: 'erc20-exchange-overview',
                 title: 'Overview',
                 messageId: 'common.overview',
                 type: 'item',
                 url: '/affiliate/nft-marketplace/overview',
               },
             ],
           },
         ],
       },*/
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
  }

  return items;
}
export default useRoutesConfig;
