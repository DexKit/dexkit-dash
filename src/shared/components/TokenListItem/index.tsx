import React from 'react';

import {
  Paper,
  Grid,
  makeStyles,
  Typography,
  Box,
  useTheme,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  icon: {
    height: theme.spacing(8),
    width: theme.spacing(8),
    borderRadius: '50%',
  },
  paper: {
    borderRadius: 6,
  },
}));

interface TokenListItemProps {
  ticker: string;
  name: string;
  amount: number;
  dayChange: number;
}

export const TokenListItem = (props: TokenListItemProps) => {
  const {ticker, name, amount, dayChange} = props;

  const classes = useStyles();
  const theme = useTheme();

  return (
    <Paper className={classes.paper}>
      <Box p={4}>
        <Grid container alignItems='center' justify='space-between'>
          <Grid item>
            <Grid container alignItems='center' spacing={2}>
              <Grid item>
                <img className={classes.icon} />
              </Grid>
              <Grid item>
                <Typography variant='body1'>{ticker}</Typography>
                <Typography variant='body2'>{name}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant='body1'>${amount}</Typography>
            <Typography
              style={{
                color:
                  dayChange >= 0
                    ? theme.palette.success.main
                    : theme.palette.error.main,
              }}
              variant='body2'>
              {dayChange * 100}%
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default TokenListItem;
