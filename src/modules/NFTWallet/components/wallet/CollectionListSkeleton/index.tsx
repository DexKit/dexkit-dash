import React, {useEffect, useState} from 'react';

import {List} from '@material-ui/core';
import CollectionListItemSkeleton from '../CollectionListItemSkeleton';

interface Props {
  count: number;
}

export default (props: Props) => {
  const {count} = props;

  const [arr, setArr] = useState<any[]>([]);

  useEffect(() => {
    const tmp = new Array(count).fill(null);
    setArr(tmp);
  }, [count]);

  return (
    <List dense>
      {arr.map((i: any, index: number) => (
        <CollectionListItemSkeleton key={index} />
      ))}
    </List>
  );
};
