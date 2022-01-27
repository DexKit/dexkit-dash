import moment from 'moment';
import {ChainId} from 'types/blockchain';
import {Kittygotchi} from 'types/kittygotchi';

import {ethers} from 'ethers';
import {
  IMAGE_PATHS,
  KittygotchiTraitType,
  KITTYGOTCHI_METADATA_ENDPOINT,
  MUMBAI_METADATA_KITTY_ENDPOINT,
  IMAGE_PATHS_ICONS,
} from '../constants';

export const canFeedKitty = (kittygotchi?: Kittygotchi) => {
  if (kittygotchi) {
    if (kittygotchi?.lastUpdated) {
      let diff = moment()
        .utc()
        .diff(moment.unix(kittygotchi?.lastUpdated), 'seconds');

      if (diff > 60 * 60 * 24) {
        return true;
      }
    } else {
      return true;
    }
  }

  return false;
};

export const isKittyTired = (kittygotchi?: Kittygotchi) => {
  if (kittygotchi) {
    if (kittygotchi?.lastUpdated) {
      let diff = moment()
        .utc()
        .diff(moment.unix(kittygotchi?.lastUpdated), 'seconds');

      if (diff > 60 * 60 * 36) {
        return true;
      }
    }
  }

  return false;
};

export function getImageFromTrait(
  traitType: KittygotchiTraitType,
  value?: string,
) {
  let dir = '';

  switch (traitType) {
    case KittygotchiTraitType.ACCESSORIES:
      dir = 'accessories';
      break;
    case KittygotchiTraitType.BODY:
      dir = 'body';
      break;
    case KittygotchiTraitType.CLOTHES:
      dir = 'clothes';
      break;
    case KittygotchiTraitType.EARS:
      dir = 'ears';
      break;
    case KittygotchiTraitType.EYES:
      dir = 'eyes';
      break;
    case KittygotchiTraitType.MOUTH:
      dir = 'mouth';
      break;
    case KittygotchiTraitType.NOSE:
      dir = 'nose';
      break;
  }

  if (value) {
    return IMAGE_PATHS[`${dir}/${value?.toLowerCase()}.png`];
  }

  return '';
}

export function getImageFromTraitIcon(
  traitType: KittygotchiTraitType,
  value?: string,
) {
  let dir = '';

  switch (traitType) {
    case KittygotchiTraitType.ACCESSORIES:
      dir = 'accessories';
      break;
    case KittygotchiTraitType.BODY:
      dir = 'body';
      break;
    case KittygotchiTraitType.CLOTHES:
      dir = 'clothes';
      break;
    case KittygotchiTraitType.EARS:
      dir = 'ears';
      break;
    case KittygotchiTraitType.EYES:
      dir = 'eyes';
      break;
    case KittygotchiTraitType.MOUTH:
      dir = 'mouth';
      break;
    case KittygotchiTraitType.NOSE:
      dir = 'nose';
      break;
  }

  if (value) {
    return IMAGE_PATHS_ICONS[`${dir}/${value?.toLowerCase()}.png`];
  }

  return '';
}

export function getKittygotchiMetadataEndpoint(
  chainId: number,
  prefix?: string,
) {
  if (
    chainId === ChainId.Matic ||
    chainId === ChainId.Binance ||
    chainId === ChainId.Mainnet
  ) {
    if (chainId === ChainId.Mainnet) {
      return `${KITTYGOTCHI_METADATA_ENDPOINT}${
        prefix ? prefix + '/' : ''
      }eth/`;
    }

    if (chainId === ChainId.Binance) {
      return `${KITTYGOTCHI_METADATA_ENDPOINT}${
        prefix ? prefix + '/' : ''
      }bsc/`;
    }

    return KITTYGOTCHI_METADATA_ENDPOINT;
  } else if (chainId === ChainId.Mumbai) {
    return MUMBAI_METADATA_KITTY_ENDPOINT;
  }

  return KITTYGOTCHI_METADATA_ENDPOINT;
}

export function isKittygotchiNetworkSupported(chainId?: number) {
  if (chainId) {
    return (
      // chainId === ChainId.Mainnet ||
      chainId === ChainId.Ropsten ||
      chainId === ChainId.Matic ||
      chainId === ChainId.Mumbai ||
      chainId === ChainId.Binance ||
      chainId === ChainId.BinanceTest
    );
  }

  return false;
}

export function GET_KITTYGOTCHI_CHAIN_SYMBOL(chainId?: number) {
  if (chainId) {
    if (chainId === ChainId.Mainnet) {
      return 'ETH';
    } else if (chainId === ChainId.Ropsten) {
      return 'ETH';
    } else if (chainId === ChainId.Matic) {
      return 'MATIC';
    } else if (chainId === ChainId.Mumbai) {
      return 'MATIC';
    } else if (chainId === ChainId.Binance) {
      return 'BNB';
    } else if (chainId === ChainId.BinanceTest) {
      return 'BNB';
    }
  }

  return '';
}

export function GET_KITTYGOTCHI_MINT_RATE(chainId?: number) {
  if (chainId) {
    if (chainId === ChainId.Mainnet) {
      return ethers.utils.parseEther('0.01');
    } else if (chainId === ChainId.Ropsten) {
      return ethers.utils.parseEther('0.0000001');
    } else if (chainId === ChainId.Matic) {
      return ethers.utils.parseEther('10.0');
    } else if (chainId === ChainId.Mumbai) {
      return ethers.utils.parseEther('0.0000000000000001');
    } else if (chainId === ChainId.Binance) {
      return ethers.utils.parseEther('0.05');
    } else if (chainId === ChainId.BinanceTest) {
      return ethers.utils.parseEther('0.000001');
    }
  }

  return ethers.utils.parseEther('0');
}
