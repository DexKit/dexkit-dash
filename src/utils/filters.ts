import moment from 'moment';

interface Filters {
  id: string;
  type: string;
  label: string;
  value: any;
  onClose: any;
  onChange: any;
  onEnable: any;
  enable: boolean;
}

export const getFilterValueById = (id: string, filters?: Filters[]) => {
  if (filters && filters.length > 0) {
    const filter = filters.find((f) => f.id === id);
    if (filter && filter.enable) {
      return filter.value;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

export function groupItems(items: {timestamp?: number}[]) {
  const groups = items.reduce((groups: any, item) => {
    const date = moment(item.timestamp).format('YYYY-MM-DD');

    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});

  // Edit: to add it in the array format instead
  return Object.keys(groups).map((date) => {
    return {
      date,
      items: groups[date],
    };
  });
}
