import React from 'react';

import {
  Card,
  CardContent,
  Typography,
  makeStyles,
  useTheme,
} from '@material-ui/core';
import {Skeleton} from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  cardMedia: {
    height: 0,
  },
  mediaSkeleton: {
    height: theme.spacing(30),
  },
}));

export default () => {
  const theme = useTheme();
  const classes = useStyles();

  return (
    <Card>
      <Skeleton className={classes.mediaSkeleton} />
      <CardContent>
        <Typography variant='caption' color='textSecondary'>
          <Skeleton width={theme.spacing(30)} />
        </Typography>
        <Typography variant='body1'>
          <Skeleton />
        </Typography>
      </CardContent>
    </Card>
  );
};
