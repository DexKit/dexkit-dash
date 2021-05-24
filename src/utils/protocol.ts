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

type dataProtocolPair = {
  address?: string;
  contract?: string;
  baseToken: Token;
  quoteToken: Token;
};

export const GET_PROTOCOL_PAIR_URL = (
  network: EthereumNetwork,
  exchange: EXCHANGE,
  data: dataProtocolPair,
) => {
  switch (exchange) {
    case EXCHANGE.UNISWAP:
      return `/${network}/protocol-explorer/${EXCHANGE.UNISWAP}/pair-explorer/${
        data?.contract || data?.address
      }`;
    case EXCHANGE.ZEROX:
      return `/${network}/protocol-explorer/${EXCHANGE.ZEROX}/pair-explorer/${data.baseToken.address}-${data.quoteToken.address}`;
    default:
      return `/${network}/protocol-explorer/${EXCHANGE.UNISWAP}/pair-explorer/${
        data?.contract || data?.address
      }`;
  }
};

export const GET_PROTOCOL_TOKEN_URL = (
  network: EthereumNetwork,
  token: Token,
  exchange: EXCHANGE,
) => {
  switch (exchange) {
    case EXCHANGE.UNISWAP:
      return `/${network}/protocol-explorer/${EXCHANGE.UNISWAP}/token-explorer/${token.address}`;
    case EXCHANGE.ZEROX:
      return `/${network}/protocol-explorer/${EXCHANGE.ZEROX}/token-explorer/${token.address}`;
    default:
      return `/${network}/protocol-explorer/${EXCHANGE.UNISWAP}/token-explorer/${token.address}`;
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
    default:
      return EXCHANGE.ALL;
  }
};
