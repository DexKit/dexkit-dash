import React, {useMemo, useCallback} from 'react';

import {
  Paper,
  Box,
  Grid,
  Typography,
  makeStyles,
  IconButton,
  alpha,
  Tooltip,
  Link,
  useTheme,
} from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import {useUSDFormatter} from 'hooks/utils/useUSDFormatter';
import {CoinDetailCoinGecko} from 'types/coingecko/coin.interface';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {truncateAddress} from 'utils';
import FileCopy from '@material-ui/icons/FileCopy';
import CopyLink from '../CopyLink';
import {MetamaskFoxIcon} from '../Icons';
import CopyButton from '../CopyButton';

interface TokenCardProps {
  icon: React.ReactNode | React.ReactNode[];
  pair: string;
  amount?: number | string;
  price24Change?: number;
  onClick?: () => void;
  coinInfo?: CoinDetailCoinGecko;
  networkName?: EthereumNetwork;
  onAddToken?: () => void;
}

const useStyles = makeStyles((theme) => ({
  paper: {},
  price24Change: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),

    paddingTop: theme.spacing(1),

    paddingBottom: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.1),
    fontSize: 12,
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
  const {
    icon,
    price24Change,
    pair,
    amount,
    onClick,
    coinInfo,
    networkName,
    onAddToken,
  } = props;
  const {usdFormatter} = useUSDFormatter();
  const amountUSD = useMemo(() => {
    return usdFormatter.format(Number(amount));
  }, [amount]);

  const theme = useTheme();
  const classes = useStyles();

  const getTokenAddress = useCallback(() => {
    if (networkName && coinInfo) {
      if (networkName === EthereumNetwork.ethereum) {
        return coinInfo?.platforms?.ethereum;
      } else if (networkName === EthereumNetwork.bsc) {
        return coinInfo?.platforms?.['binance-smart-chain'];
      } else if (networkName === EthereumNetwork.matic) {
        return coinInfo?.platforms?.['polygon-pos'];
      }
    }
  }, [coinInfo, networkName]);

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
                <Grid
                  container
                  alignItems='center'
                  alignContent='center'
                  spacing={1}>
                  {getTokenAddress() ? (
                    <>
                      <Grid item>
                        <Typography color='textSecondary' variant='caption'>
                          {truncateAddress(getTokenAddress())}{' '}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <CopyButton
                          size='small'
                          copyText={getTokenAddress() || ''}
                          tooltip='Copied!'>
                          <FileCopy color='inherit' style={{fontSize: 16}} />
                        </CopyButton>
                      </Grid>
                    </>
                  ) : null}
                  {onAddToken ? (
                    <Grid item>
                      <Tooltip title='Add to Metamask'>
                        <IconButton onClick={onAddToken} size='small'>
                          <MetamaskFoxIcon style={{width: 16, height: 16}} />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  ) : null}
                </Grid>

                <Box display='flex' alignItems='center' alignContent='center'>
                  <Box mr={2}>
                    <Typography className={classes.amount} variant='h5'>
                      {amountUSD}{' '}
                    </Typography>
                  </Box>
                  {price24Change && (
                    <span
                      className={classes.price24Change}
                      style={
                        price24Change > 0
                          ? {
                              color: theme.palette.success.main,
                            }
                          : {
                              color: theme.palette.error.main,
                            }
                      }>
                      {price24Change}%
                    </span>
                  )}
                </Box>
              </Grid>
            </Grid>
            <Tooltip title={coinInfo?.name || ''}>
              <Typography className={classes.pair} variant='body1'>
                {pair.toUpperCase()}
              </Typography>
            </Tooltip>
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
