import {BigNumber} from '@0x/utils';

export const getExpirationTimeFromSeconds = (seconds: BigNumber) => {
  return new BigNumber(
    Math.floor(new Date().valueOf() / 1000) + seconds.toNumber(),
  );
};

export const getLast24HoursDate = () => {
  return new Date(new Date().getTime() - 24 * 3600 * 1000);
};

export const getAfer24HoursDate = () => {
  return new Date(new Date().getTime() + 24 * 3600 * 1000);
};
