import {Grid, Card, CardContent} from '@material-ui/core';
import React, {useEffect, useState} from 'react';
import AssetCardSkeleton from '../../detail/AssetCardSkeleton';

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
    <Grid container spacing={2}>
      {arr.map((i, index: number) => (
        <Grid key={index} item xs={12} sm={3}>
          <AssetCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
};
