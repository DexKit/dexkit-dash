import {Grid} from '@material-ui/core';
import React, {useEffect, useState} from 'react';
import AssetCardSkeleton from '../AssetCardSkeleton';

interface Props {
  count: number;
}

export default (props: Props) => {
  const {count} = props;

  let [arr, setArr] = useState<any[]>([]);

  useEffect(() => {
    let tmp = new Array(count).fill(null);
    setArr(tmp);
  }, [count]);

  return (
    <Grid container spacing={2}>
      {arr.map((i) => (
        <Grid key={i} item xs={12} sm={3}>
          <AssetCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
};
