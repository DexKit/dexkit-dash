import moment from 'moment';

export function sortEventArray(arr: any[]): any[] {
  return arr
    .sort((a, b) => {
      let dateA = moment(a.created_date);
      let dateB = moment(b.created_date);

      if (dateA.isBefore(dateB)) {
        return -1;
      } else if (dateA.isAfter(dateB)) {
        return 1;
      }

      return 0;
    })
    .reverse();
}