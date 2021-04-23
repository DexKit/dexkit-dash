import { BigNumber } from "@0x/utils";
import { ChainId } from "types/blockchain";

export const initialUrl = '/dashboard/overview'; // this url will open after login

export const ONE_SECOND_MS = 1000;

export const ONE_MINUTE_MS = 1000 * 60;

export const SECONDS_IN_A_DAY = new BigNumber(60 * 60 * 24);

export const QUOTE_ORDER_EXPIRATION_BUFFER_MS = ONE_SECOND_MS * 30; // Ignore orders that expire in 30 seconds

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

export const ZEROX_API_URL = (chainId: ChainId|undefined) => {
  switch (chainId) {
    case ChainId.Mainnet:
      return 'https://api.0x.org';//'/swap/v1/quote'
    case ChainId.Kovan:
      return 'https://kovan.api.0x.org';//'/swap/v1/quote'
    default:
      return '';
  }
};

export const ETHERSCAN_API_URL = (chainId: ChainId|undefined) => {
  switch(chainId) {
    case ChainId.Mainnet: return 'https://etherscan.io';
    case ChainId.Kovan: return 'https://kovan.etherscan.io';
    default: return 'https://etherscan.io';
  }
}

export const UNISWAP_INFO_API_URL = 'https://info.uniswap.org';

export const DEXTOOLS_API_URL = 'https://www.dextools.io';