import moment from 'moment';

export function humanizeDate(date: string) {
  const tempDate = moment(date);
  const isSameDay = tempDate.day() === moment().day();
  const isSameMonth = tempDate.month() === moment().month();
  const isSameYear = tempDate.year() === moment().year();

  const isSameDate = isSameDay && isSameMonth && isSameYear;

  const isYesterday =
    isSameYear &&
    isSameMonth &&
    tempDate.day() === moment().subtract(1, 'day').day();

  if (isSameDate) {
    return 'Today';
  }

  if (isYesterday) {
    return 'Yesterday';
  }

  return tempDate.format('DD/MM/YYYY');
}
