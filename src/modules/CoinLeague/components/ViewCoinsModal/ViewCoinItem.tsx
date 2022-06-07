import React, {useMemo} from 'react';

import {
  Box,
  Grid,
  makeStyles,
  TableCell,
  TableRow,
  Typography,
  useTheme,
} from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import {CoinFeed} from 'modules/CoinLeague/utils/types';
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
    <TableRow>
      <TableCell>
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
        </Grid>
      </TableCell>
      <TableCell>
        <Typography variant='body2' color='textSecondary'>
          {priceStart}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant='body2' color='textSecondary'>
          {priceEnd}
        </Typography>
      </TableCell>
      <TableCell>
        {priceScore ? (
          <>
            <Grid container spacing={2}>
              {isCaptain && (
                <Grid item>
                  <Tooltip title={tooltipMessage(playerAddress)}>
                    <Chip
                      size='small'
                      color='primary'
                      label={`x ${multipliers(playerAddress).toFixed(3)}`}
                    />
                  </Tooltip>
                </Grid>
              )}
              <Grid item>
                <Chip
                  size='small'
                  variant='outlined'
                  style={{
                    color:
                      Number(priceScore) > 0
                        ? theme.palette.success.main
                        : theme.palette.error.main,
                  }}
                  label={`${Number(priceScore) > 0 ? '+' : ''}${Number(
                    priceScore,
                  ).toFixed(5)}%`}
                />
              </Grid>
            </Grid>
          </>
        ) : (
          <Typography variant='body1'>-</Typography>
        )}
      </TableCell>
    </TableRow>
  );
};

export default ViewCoinListItem;
