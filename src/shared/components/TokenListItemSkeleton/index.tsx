import React from 'react';

import {
  Paper,
  Grid,
  makeStyles,
  Typography,
  Box,
  useTheme,
} from '@material-ui/core';

import {Skeleton} from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  icon: {
    height: theme.spacing(8),
    width: theme.spacing(8),
    borderRadius: '50%',
  },
  paper: {
    borderRadius: 6,
    display: 'block',
    textAlign: 'left',
  },
}));

interface TokenListItemSkeletonProps {}

export const TokenListItemSkeleton = (props: TokenListItemSkeletonProps) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Paper className={classes.paper}>
      <Box p={4}>
        <Grid container alignItems='center' justify='space-between'>
          <Grid item>
            <Grid container alignItems='center' spacing={2}>
              <Grid item>
                <Skeleton
                  variant='circle'
                  width={theme.spacing(12)}
                  height={theme.spacing(12)}
                />
              </Grid>
              <Grid item>
                <Typography variant='body1'>
                  <Skeleton width={theme.spacing(20)} />
                </Typography>
                <Typography variant='body2'>
                  <Skeleton width={theme.spacing(12)} />
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container spacing={2} alignItems='center'>
              <Grid item>
                <Typography align='right' variant='body1'>
                  <Skeleton width={theme.spacing(18)} />
                </Typography>
                <Typography align='right' variant='body2'>
                  <Skeleton width={theme.spacing(8)} />
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default TokenListItemSkeleton;
