import React from 'react';

import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {Skeleton} from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  cardMedia: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  mediaSkeleton: {
    height: '56.25%',
  },
}));

export default () => {
  const classes = useStyles();

  return (
    <Card>
      <Skeleton height={200} />
      <CardContent>
        <Typography variant='caption' color='textSecondary'>
          <Skeleton />
        </Typography>
        <Typography>
          <Skeleton />
        </Typography>
      </CardContent>
    </Card>
  );
};
