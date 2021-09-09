import {Box, makeStyles, useTheme, Grid, Typography} from '@material-ui/core';
import React, { useMemo } from 'react';

import {CoinFeed} from 'modules/CoinsLeague/utils/types';
import { CoinFeed as CoinFeedOnChain} from 'types/coinsleague';
import { useUSDFormatter } from 'hooks/utils/useUSDFormatter';
import { BigNumber } from 'ethers';

export interface Props {
  coin: CoinFeed;
  feedOnchain: CoinFeedOnChain;
  style: React.CSSProperties;
}

const useStyles = makeStyles((theme) => ({
  tokenContainer: {
    borderRadius: '50%',
    backgroundColor: '#fff',
    height: theme.spacing(9),
    width: theme.spacing(9),
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    display: 'flex',
  },
  token: {
    height: theme.spacing(6),
    width: theme.spacing(6),
  },
  item: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
    },
  },
}));

const USD_POWER = BigNumber.from(10**8);

export const ViewCoinListItem = (props: Props) => {
  const {coin, style, feedOnchain} = props;
  const {usdFormatter} = useUSDFormatter()
  const theme = useTheme();
  const classes = useStyles();
  const priceStart = useMemo(()=>{
    if(feedOnchain.start_price){
      return usdFormatter.format(feedOnchain.start_price.div(USD_POWER).toNumber())
    }
    return '-'

  },[feedOnchain.start_price])

  const priceEnd = useMemo(()=>{
    if(feedOnchain.end_price){
      return usdFormatter.format(feedOnchain.end_price.div(USD_POWER).toNumber())
    }
    return '-'

  },[feedOnchain.end_price])

  const priceScore = useMemo(()=>{
    if(feedOnchain.start_price && feedOnchain.end_price){
      if(feedOnchain.start_price.eq('0')){
        return '0';
      }
      const endPrice = feedOnchain.end_price.toNumber();
      const startPrice = feedOnchain.start_price.toNumber();

      return (((endPrice - startPrice)/startPrice) * 100).toFixed(2)
    }


  },[feedOnchain.start_price, feedOnchain.end_price])
  console.log(feedOnchain.start_price.toNumber())
  console.log(feedOnchain.end_price.toNumber())
  console.log(priceScore)

  return (
    <Box style={{...style, padding: theme.spacing(4)}} className={classes.item}>
      <Grid alignItems='center' alignContent='center' container spacing={6}>
        <Grid item>
          <Box className={classes.tokenContainer}>
            <img src={coin.logo} className={classes.token} />
          </Box>
        </Grid>

        <Grid item xs={3}>
          <Typography variant='body1'>{`${coin.base.toUpperCase()}`}</Typography>
          <Typography variant='body2' color='textSecondary'>
            {coin.baseName}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant='body1'>{`Start`}</Typography>
          <Typography variant='body2' color='textSecondary'>
           {priceStart}
          </Typography>
        </Grid>
        <Grid item xs>
          <Typography variant='body1'>{`End`}</Typography>
          <Typography variant='body2' color='textSecondary'>
            {priceEnd}
          </Typography>
        </Grid>

        <Grid item>
          <Typography variant='body1'>{priceScore}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewCoinListItem;
