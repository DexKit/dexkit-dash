import React from 'react';

import Typography from '@material-ui/core/Typography';

import Skeleton from '@material-ui/lab/Skeleton';

function CountdownSkeleton(): JSX.Element {
  return (
    <Typography variant='h5' color='textPrimary'>
      <Skeleton>-</Skeleton>
    </Typography>
  );
}

export default CountdownSkeleton;
