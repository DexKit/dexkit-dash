import React from 'react';

import {
  Paper,
  Grid,
  makeStyles,
  Box,
  Typography,
  useTheme,
} from '@material-ui/core';
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
  colorsEnabled?: boolean;
  notUsdValue?: boolean;
}

export const AnalyticsAmountCard = (props: AnalyticsAmountCardProps) => {
  const {
    amount,
    caption,
    onClick,
    icon,
    isLoading,
    colorsEnabled,
    notUsdValue,
  } = props;

  const classes = useStyles();

  const {usdFormatter} = useUSDFormatter();

  const theme = useTheme();

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

            <Typography
              style={
                colorsEnabled
                  ? {
                      color:
                        typeof amount === 'number' && amount < 0
                          ? theme.palette.error.main
                          : theme.palette.success.main,
                    }
                  : undefined
              }
              variant='h5'>
              {typeof amount === 'number'
                ? notUsdValue
                  ? amount
                  : usdFormatter.format(amount)
                : amount}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default AnalyticsAmountCard;
