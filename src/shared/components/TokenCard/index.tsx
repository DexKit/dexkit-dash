import React, { useMemo } from 'react';

import {
  Paper,
  Box,
  Grid,
  Typography,
  makeStyles,
  IconButton,
  alpha,
} from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { useUSDFormatter } from 'hooks/utils/useUSDFormatter';

interface TokenCardProps {
  icon: React.ReactNode | React.ReactNode[];
  pair: string;
  amount: number;
  price24Change?: number;
  onClick?: () => void;
}

const useStyles = makeStyles((theme) => ({
  paper: {},
  price24Change: {
    color: theme.palette.success.main,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),

    paddingTop: theme.spacing(1),

    paddingBottom: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.1),
    fontSize: 14,
    fontWeight: 500,
  },
  amount: {
    fontWeight: 600,
    fontSize: 24,
  },
  pair: {
    fontWeight: 400,
    fontSize: 14,
  },
}));

export const TokenCard = (props: TokenCardProps) => {
  const {icon, price24Change, pair, amount, onClick} = props;
  const {usdFormatter} = useUSDFormatter();
  const amountUSD = useMemo(()=> {
    return usdFormatter.format(amount);

  }, [amount])

  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Box p={4}>
        <Grid container spacing={4} alignItems='center'>
          <Grid item>
            <Box
              display='flex'
              alignItems='center'
              alignContent='center'
              justifyContent='center'>
              {icon}
            </Box>
          </Grid>
          <Grid item xs>
            <Grid container spacing={2} alignItems='center'>
              <Grid item>
                <Typography className={classes.amount} variant='h5'>
                {amountUSD}
                </Typography>
              </Grid>
              {price24Change && <Grid item>
                <Typography className={classes.price24Change}>
                  {price24Change}%
                </Typography>
              </Grid>}
            </Grid>
            <Typography className={classes.pair} variant='body1'>
              {pair.toUpperCase()}
            </Typography>
          </Grid>
          <Grid item>
            <IconButton onClick={onClick}>
              <KeyboardArrowDownIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default TokenCard;
