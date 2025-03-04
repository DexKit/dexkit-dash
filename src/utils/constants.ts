import {BigNumber} from '@0x/utils';
import {CoinIcons} from 'shared/constants/AppEnums';
import {ChainId} from 'types/blockchain';

export function matchCoinSymbol(symbol: string): string {
  if (
    symbol.toLocaleLowerCase() === 'bitcoin' ||
    symbol.toLocaleLowerCase() === 'btc'
  ) {
    return CoinIcons.BITCOIN_WHITE;
  } else if (symbol.toLocaleLowerCase().search('eth')) {
    return CoinIcons.ETHERIUM;
  } else if (
    symbol.toLocaleLowerCase().search('lit') ||
    symbol.toLocaleLowerCase() === 'ltc'
  ) {
    return CoinIcons.LITECOIN;
  } else if (symbol.toLocaleLowerCase().search('rip')) {
    return CoinIcons.RIPPLE;
  } else if (
    symbol.toLocaleLowerCase().search('mon') ||
    symbol.toLocaleLowerCase() === 'xmr'
  ) {
    return CoinIcons.BITCOIN_WHITE;
  } else {
    return '';
  }
}

export const TRADE_API_URL = (chainId: ChainId) => {
  switch (chainId) {
    case ChainId.Mainnet:
      return 'https://query.dexkit.com/v4';
    case ChainId.Ropsten:
      return '';
    case ChainId.Kovan:
      return 'https://kovan.api.dexkit.com/v3';
    default:
      return 'https://query.dexkit.com/v4';
  }
};

export const ONE_MINUTE_MS = 1000 * 60;
export const DEFAULT_ESTIMATED_TRANSACTION_TIME_MS = ONE_MINUTE_MS * 2;
export const GWEI_IN_WEI = new BigNumber(1000000000);
export const DEFAULT_GAS_PRICE = GWEI_IN_WEI.multipliedBy(6);
export const ETH_GAS_STATION_API_BASE_URL = 'https://ethgasstation.info';
export const TOKEN_CONTRACT_ENDPOINT =
  'https://api.coingecko.com/api/v3/coins/ethereum/contract/';
export const TRANSAK_API_URL = `https://api.transak.com/api/v2/currencies/crypto-currencies`;
export const COINGECKO_TOKENS_URL = `https://tokens.coingecko.com/uniswap/all.json`;
export const OPENSEA_REST_API = `https://api.opensea.io/api/v1`;
