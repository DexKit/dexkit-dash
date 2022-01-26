import {BigNumber} from '@0x/utils';
import {ChainId} from 'types/blockchain';
import {EthereumNetwork} from './AppEnums';

export const initialUrl = `/wallet`;

export const ONE_SECOND_MS = 1000;

export const ONE_MINUTE_MS = 1000 * 60;

export const SECONDS_IN_A_DAY = new BigNumber(60 * 60 * 24);

export const QUOTE_ORDER_EXPIRATION_BUFFER_MS = ONE_SECOND_MS * 30; // Ignore orders that expire in 30 seconds

export const POLL_INTERVAL = 60000;

// export const RELAYER_URL = (chainId: ChainId) => {
//   switch (chainId) {
//     case ChainId.Mainnet:
//       return 'https://api.0x.org/sra/v3';
//     case ChainId.Ropsten:
//       return '';
//     case ChainId.Kovan:
//       return 'https://kovan.api.0x.org/sra/v3';
//     default:
//       return '';
//   }
// };

export const ZRX_TRACKER_URL = 'https://api.0xtracker.com';

export const ETH_GAS_STATION_URL =
  'https://ethgasstation.info/api/ethgasAPI.json';

export const ZRX_API_URL = (chainId: ChainId | undefined) => {
  switch (Number(chainId)) {
    case ChainId.Mainnet:
      return 'https://api.0x.org'; //'/swap/v1/quote'
    case ChainId.Binance:
      return 'https://bsc.api.0x.org'; //'/swap/v1/quote'
    case ChainId.Matic:
      return 'https://polygon.api.0x.org'; //'/swap/v1/quote'
    case ChainId.Kovan:
      return 'https://kovan.api.0x.org'; //'/swap/v1/quote'
    case ChainId.Ropsten:
      return 'https://ropsten.api.0x.org'; //'/swap/v1/quote'
    default:
      return '';
  }
};

export const ZRX_API_URL_FROM_NETWORK = (
  network: EthereumNetwork,
  chainId?: ChainId,
) => {
  if (chainId === ChainId.Ropsten) {
    // we bypass here the API if we need to test it on testnet by passing the chainId
    return ZRX_API_URL(chainId);
  }

  switch (network) {
    case EthereumNetwork.ethereum:
      return 'https://api.0x.org'; //'/swap/v1/quote'
    /* eslint-disable */
    case EthereumNetwork.ethereum:
      return 'https://kovan.api.0x.org'; //'/swap/v1/quote'
    /* eslint-disable */
    case EthereumNetwork.ethereum:
      return 'https://ropsten.api.0x.org'; //'/swap/v1/quote'
    case EthereumNetwork.bsc:
      return 'https://bsc.api.0x.org'; //'/swap/v1/quote'
    case EthereumNetwork.matic:
      return 'https://polygon.api.0x.org'; //'/swap/v1/quote'
    default:
      return 'https://api.0x.org';
  }
};

export const ETHERSCAN_API_URL = (chainId: ChainId | undefined) => {
  switch (chainId) {
    case ChainId.Mainnet:
      return 'https://etherscan.io';
    case ChainId.Binance:
      return 'https://bscscan.com/';
    case ChainId.Matic:
      return 'https://polygonscan.com/';
    case ChainId.Kovan:
      return 'https://kovan.etherscan.io';
    default:
      return 'https://etherscan.io';
  }
};
export const ETHERSCAN_API_URL_FROM_NETWORK = (network: EthereumNetwork) => {
  switch (network) {
    case EthereumNetwork.ethereum:
      return 'https://etherscan.io';
    case EthereumNetwork.bsc:
      return 'https://bscscan.com/';
    case EthereumNetwork.matic:
      return 'https://polygonscan.com/';
    default:
      return 'https://etherscan.io';
  }
};

export const GET_ZRX_FLASH_WALLET = (chainId: ChainId | undefined) => {
  const id = Number(chainId);

  switch (id) {
    case ChainId.Mainnet:
      return '0x22F9dCF4647084d6C31b2765F6910cd85C178C18';
    case ChainId.Kovan:
      return '0x22F9dCF4647084d6C31b2765F6910cd85C178C18';
    case ChainId.Ropsten:
      return '0x22F9dCF4647084d6C31b2765F6910cd85C178C18';
    case ChainId.Binance:
      return '0x22F9dCF4647084d6C31b2765F6910cd85C178C18';
    case ChainId.BinanceTest:
      return '0x22F9dCF4647084d6C31b2765F6910cd85C178C18';
    default:
      return undefined;
  }
};

export const UNISWAP_INFO_API_URL = 'https://info.uniswap.org';

export const SUSHISWAP_INFO_API_URL = 'https://analytics.sushi.com';

export const DEXTOOLS_API_URL = 'https://www.dextools.io';

export const COINGECKO_URL = 'https://api.coingecko.com/api/v3/coins';

export const COINGECKO_URL_SIMPLE_PRICE =
  'https://api.coingecko.com/api/v3/simple/price';

export const COINGECKO_CONTRACT_URL =
  'https://api.coingecko.com/api/v3/coins/ethereum/contract';

export const getCoingeckoContractUrlFromNetwork = (
  network: EthereumNetwork,
) => {
  switch (network) {
    case EthereumNetwork.bsc:
      return 'https://api.coingecko.com/api/v3/coins/binance-smart-chain/contract';
    case EthereumNetwork.matic:
      return 'https://api.coingecko.com/api/v3/coins/polygon-pos/contract';

    default:
      return 'https://api.coingecko.com/api/v3/coins/ethereum/contract';
  }
};
