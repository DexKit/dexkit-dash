import moment from 'moment';
import {ChainId} from 'types/blockchain';
import {Kittygotchi} from 'types/kittygotchi';
import {
  IMAGE_PATHS,
  KittygotchiTraitType,
  POLYGON_METADATA_KITTY_ENDPOINT,
  MUMBAI_METADATA_KITTY_ENDPOINT,
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
    case KittygotchiTraitType.ACESSOIRES:
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

export function getKittygotchiMetadataEndpoint(chainId: number) {
  if (chainId === ChainId.Matic) {
    return POLYGON_METADATA_KITTY_ENDPOINT;
  } else if (chainId === ChainId.Mumbai) {
    return MUMBAI_METADATA_KITTY_ENDPOINT;
  }

  return POLYGON_METADATA_KITTY_ENDPOINT;
}
