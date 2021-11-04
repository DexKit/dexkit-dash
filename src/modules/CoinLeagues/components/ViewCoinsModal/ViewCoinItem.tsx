import {Box, makeStyles, useTheme, Grid, Typography} from '@material-ui/core';
import React, {useMemo} from 'react';
import Chip from '@material-ui/core/Chip';
import {CoinFeed} from 'modules/CoinLeagues/utils/types';
import {CoinFeed as CoinFeedOnChain} from 'types/coinsleague';
import {useUSDFormatter} from 'hooks/utils/useUSDFormatter';
import Tooltip from '@material-ui/core/Tooltip';
import {useMobile} from 'hooks/useMobile';

export interface Props {
  coin: CoinFeed;
  feedOnchain: CoinFeedOnChain;
  currentPrice: any;
  started?: boolean;
  isCaptain?: boolean;
  multipliers?: any;
  playerAddress?: string;
  tooltipMessage?: any;
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

const USD_POWER_NUMBER = 10 ** 8;

export const ViewCoinListItem = (props: Props) => {
  const {
    coin,
    feedOnchain,
    started,
    currentPrice,
    isCaptain,
    playerAddress,
    multipliers,
    tooltipMessage,
  } = props;
  const isMobile = useMobile();

  //const {multiplier} = useMultipliers(address);
  const {usdFormatter} = useUSDFormatter();
  const theme = useTheme();
  const classes = useStyles();

  /* eslint-disable */
  const priceStart = useMemo(() => {
    if (feedOnchain.start_price) {
      return usdFormatter.format(
        feedOnchain.start_price.toNumber() / USD_POWER_NUMBER,
      );
    }
    return '-';
  }, [feedOnchain.start_price]);

  const priceEnd = useMemo(() => {
    if (started) {
      if (currentPrice?.price) {
        return usdFormatter.format(
          currentPrice.price.toNumber() / USD_POWER_NUMBER,
        );
      }
    }

    if (feedOnchain.end_price) {
      return usdFormatter.format(
        feedOnchain.end_price.toNumber() / USD_POWER_NUMBER,
      );
    }
    return '-';
  }, [feedOnchain.end_price, started, currentPrice]);

  const priceScore = useMemo(() => {
    if (feedOnchain.start_price && feedOnchain.end_price && currentPrice) {
      if (feedOnchain.start_price.eq('0')) {
        return '0';
      }
      if (!started) {
        if (isCaptain) {
          return (
            (feedOnchain.score.toNumber() * multipliers(playerAddress)) / 1000
          );
        } else {
          return feedOnchain.score.toNumber() / 1000;
        }
      }

      const endPrice = started
        ? currentPrice?.price.toNumber()
        : feedOnchain.end_price.toNumber();
      const startPrice = feedOnchain.start_price.toNumber();
      if (isCaptain) {
        return (
          ((endPrice - startPrice) / startPrice) *
          100 *
          multipliers(playerAddress)
        ).toFixed(2);
      } else {
        return (((endPrice - startPrice) / startPrice) * 100).toFixed(2);
      }
    }
  }, [
    feedOnchain.start_price,
    feedOnchain.end_price,
    started,
    currentPrice,
    isCaptain,
    playerAddress,
    multipliers,
  ]);

  return (
    <Box style={{padding: theme.spacing(4)}} className={classes.item}>
      <Grid alignItems='center' alignContent='center' container spacing={6}>
        {!isMobile && (
          <Grid item>
            <Box className={classes.tokenContainer}>
              <img src={coin.logo} className={classes.token} />
            </Box>
          </Grid>
        )}

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
        {started ? (
          <Grid item xs>
            <Typography variant='body1'>{`Current`}</Typography>
            <Typography variant='body2' color='textSecondary'>
              {priceEnd}
            </Typography>
          </Grid>
        ) : (
          <Grid item xs>
            <Typography variant='body1'>{`End`}</Typography>
            <Typography variant='body2' color='textSecondary'>
              {priceEnd}
            </Typography>
          </Grid>
        )}

        <Grid item>
          {priceScore ? (
            <>
              {isCaptain && (
                <Tooltip title={tooltipMessage(playerAddress)}>
                  <Chip
                    color={'primary'}
                    label={`x ${multipliers(playerAddress)}`}
                  />
                </Tooltip>
              )}
              <Chip
                clickable
                style={{
                  background: '#343A49',
                  color: Number(priceScore) > 0 ? '#0e0' : '#e00',
                }}
                label={`${Number(priceScore) > 0 ? '+' : ''}${priceScore}%`}
              />
            </>
          ) : (
            <Typography variant='body1'> -</Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewCoinListItem;
