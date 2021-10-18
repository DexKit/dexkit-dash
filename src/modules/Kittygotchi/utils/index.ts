import moment from 'moment';
import {Kittygotchi} from 'types/kittygotchi';

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
