import React from 'react';

import {Paper, Grid, makeStyles, Box, Typography} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

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
}));

interface AnalyticsAmountCardProps {
  icon: React.ReactNode | React.ReactNode[];
  amount: number;
  caption: string;
  isLoading?: boolean;
  onClick?: () => void;
}

export const AnalyticsAmountCard = (props: AnalyticsAmountCardProps) => {
  const {amount, caption, onClick, icon, isLoading} = props;

  const classes = useStyles();

  return isLoading ? (
    <Skeleton>
      <Paper className={classes.paper} onClick={onClick}>
        <Box p={4}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              {icon}
            </Grid>
            <Grid item xs={12}>
              <Typography color='textSecondary' variant='caption'>
                {caption}
              </Typography>
              <Typography variant='h5'>0.00</Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Skeleton>
  ) : (
    <Paper className={classes.paper} onClick={onClick}>
      <Box p={4}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            {icon}
          </Grid>
          <Grid item xs={12}>
            <Typography color='textSecondary' variant='caption'>
              {caption}
            </Typography>
            <Typography variant='h5'>{amount}</Typography>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default AnalyticsAmountCard;
