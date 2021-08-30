import React from 'react';

import {Paper, Grid, makeStyles, Box, Typography} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import {useUSDFormatter} from 'hooks/utils/useUSDFormatter';

const useStyles = makeStyles(() => ({
  icon: {
    width: '100%',
    height: 'auto',
  },
  paper: {
    textAlign: 'left',
    borderRadius: 6,
    backgroundColor: '#2E3243',
  },
  caption: {
    whiteSpace: 'nowrap',
  },
}));

interface AnalyticsAmountCardProps {
  icon: React.ReactNode | React.ReactNode[];
  amount: number | string;
  caption: string;
  isLoading?: boolean;
  onClick?: () => void;
}

export const AnalyticsAmountCard = (props: AnalyticsAmountCardProps) => {
  const {amount, caption, onClick, icon, isLoading} = props;

  const classes = useStyles();

  const {usdFormatter} = useUSDFormatter();

  return isLoading ? (
    <Paper className={classes.paper} onClick={onClick}>
      <Box p={4}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            {icon}
          </Grid>
          <Grid item xs={12}>
            <Typography
              className={classes.caption}
              color='textSecondary'
              variant='caption'>
              {caption}
            </Typography>
            <Skeleton>
              <Typography variant='h5'>0.00</Typography>
            </Skeleton>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  ) : (
    <Paper className={classes.paper} onClick={onClick}>
      <Box p={4}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            {icon}
          </Grid>
          <Grid item xs={12}>
            <Typography
              className={classes.caption}
              color='textSecondary'
              variant='caption'>
              {caption}
            </Typography>
            <Typography variant='h5'>
              {typeof amount === 'number'
                ? usdFormatter.format(amount)
                : amount}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default AnalyticsAmountCard;
