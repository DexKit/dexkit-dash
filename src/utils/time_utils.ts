import {BigNumber} from '@0x/utils';
import moment from 'moment';
import {leftPad} from 'utils';

export const getExpirationTimeFromSeconds = (seconds: BigNumber) => {
  return new BigNumber(
    Math.floor(new Date().valueOf() / 1000) + seconds.toNumber(),
  );
};

export const getLast24HoursDate = () => {
  return new Date(new Date().getTime() - 24 * 3600 * 1000);
};

export const getLast72HoursDate = () => {
  return new Date(new Date().getTime() - 24 * 3600 * 1000 * 3);
};

export const getAfer24HoursDate = () => {
  return new Date(new Date().getTime() + 24 * 3600 * 1000);
};

export function countDownText(
  fromDate: moment.Moment = moment().utc(),
  toDate: moment.Moment,
) {
  let hours = toDate.diff(fromDate, 'hours');

  let minutes = toDate.diff(fromDate, 'minutes');

  let seconds = toDate.diff(fromDate, 'seconds');

  return `${leftPad(hours, 2)}:${leftPad(minutes - hours * 60, 2)}:${leftPad(
    seconds - minutes * 60,
    2,
  )}`;
}
