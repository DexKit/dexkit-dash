import {Token} from 'types/app';
import {
  EXCHANGE,
  EthereumNetwork,
  EXCHANGE_NAME_ON_URL,
} from 'shared/constants/AppEnums';
import {
  DEXTOOLS_API_URL,
  UNISWAP_INFO_API_URL,
  SUSHISWAP_INFO_API_URL,
} from 'shared/constants/AppConst';


export const IS_AMM  = (exchange: EXCHANGE) => {
     switch (exchange) {
       case EXCHANGE.PANCAKEV2:
         return true;
       case EXCHANGE.SUSHISWAP:
         return true;
       case EXCHANGE.UNISWAP:
         return true;
       default:
        return false;
     }


}


export const GET_PROTOCOL_PAIR_URL = (
  network: EthereumNetwork,
  exchange: EXCHANGE,
  address: string | null | undefined,
  baseAddress: string | null | undefined,
  quoteAddress: string | null | undefined,
) => {
  switch (exchange) {
    case EXCHANGE.ZEROX:
      return `/protocol-explorer/pair-explorer/${baseAddress}-${quoteAddress}?network=${network}`;
    default:
      return `/protocol-explorer/pair-explorer/${baseAddress}-${quoteAddress}?network=${network}`;
  }
};


export const GET_PROTOCOL_TOKEN_URL = (
  network: EthereumNetwork,
  address: string | null | undefined,
  exchange: EXCHANGE,
) => {
  switch (exchange) {
    case EXCHANGE.UNISWAP:
      return `/protocol-explorer/token-explorer/${address}?network=${network}`;
    case EXCHANGE.ZEROX:
      return `/protocol-explorer/token-explorer/${address}?network=${network}`;
    default:
      return `/protocol-explorer/token-explorer/${address}?network=${network}`;
  }
};

export const GET_DEXTOOLS_URL = (exchange: EXCHANGE, address: string) => {
  switch (exchange) {
    case EXCHANGE.UNISWAP:
      return `${DEXTOOLS_API_URL}/app/uniswap/pair-explorer/${address}`;
    case EXCHANGE.SUSHISWAP:
      return `${DEXTOOLS_API_URL}/app/sushiswap/pair-explorer/${address}`;
    default:
      return null;
  }
};

export const GET_AMM_ANALYTICS = (exchange: EXCHANGE, address: string) => {
  switch (exchange) {
    case EXCHANGE.UNISWAP:
      return {
        url: `${UNISWAP_INFO_API_URL}/pair/${address}`,
        icon: '/images/uniswap.png',
      };
    case EXCHANGE.SUSHISWAP:
      return {
        url: `${SUSHISWAP_INFO_API_URL}/pair/${address}`,
        icon: '/images/sushiswap.png',
      };
    default:
      return null;
  }
};

export const GET_EXCHANGE_FROM_URL = (exchangeURL: EXCHANGE_NAME_ON_URL) => {
  switch (exchangeURL) {
    case EXCHANGE_NAME_ON_URL.UNISWAP:
      return EXCHANGE.UNISWAP;
    case EXCHANGE_NAME_ON_URL.SUSHISWAP:
      return EXCHANGE.SUSHISWAP;
    case EXCHANGE_NAME_ON_URL.ZEROX:
      return EXCHANGE.ZEROX;
    case EXCHANGE_NAME_ON_URL.BALANCER:
      return EXCHANGE.BALANCER;
    case EXCHANGE_NAME_ON_URL.PANCAKEV2:
      return EXCHANGE.PANCAKEV2;
    default:
      return EXCHANGE.ALL;
  }
};


export const GET_URL_NAME_EXCHANGE = (exchange: EXCHANGE) => {
  switch (exchange) {
    case EXCHANGE.UNISWAP:
      return EXCHANGE_NAME_ON_URL.UNISWAP;
    case EXCHANGE.SUSHISWAP:
      return EXCHANGE_NAME_ON_URL.SUSHISWAP;
    case EXCHANGE.ZEROX:
      return EXCHANGE.ZEROX;
    case EXCHANGE.BALANCER:
      return EXCHANGE_NAME_ON_URL.BALANCER;
    case EXCHANGE.PANCAKEV2:
      return EXCHANGE_NAME_ON_URL.PANCAKEV2;
    default:
      return EXCHANGE.ALL;
  }
};

export const GET_PROTOCOL_POOL_URL = (
  network: EthereumNetwork,
  exchange: EXCHANGE,
  address: string | null | undefined,
) => {
    return `/protocol-explorer/pool-explorer/${address}?network=${network}&protocol=${GET_URL_NAME_EXCHANGE(exchange)}`;
};
