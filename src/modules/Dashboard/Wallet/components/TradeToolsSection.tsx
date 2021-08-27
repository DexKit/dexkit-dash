import React, {useCallback, useState, useEffect} from 'react';

import {
  Box,
  Grid,
  Typography,
  makeStyles,
  useTheme,
  useMediaQuery,
} from '@material-ui/core';

import RoundedIconButton from 'shared/components/ActionsButtons/RoundedIconButton';

import {ReactComponent as BitcoinConvertWhiteIcon} from 'assets/images/icons/bitcoin-convert-white.svg';
import {ReactComponent as MoneySendIcon} from 'assets/images/icons/money-send.svg';
import {ReactComponent as ConverIcon} from 'assets/images/icons/convert.svg';
import {ReactComponent as DollarCircleIcon} from 'assets/images/icons/dollar-circle.svg';
import {ReactComponent as ExportWhiteIcon} from 'assets/images/icons/export-white.svg';
import {ReactComponent as ImportWhiteIcon} from 'assets/images/icons/import-white.svg';
import {ReactComponent as AddCircleIcon} from 'assets/images/icons/add-circle.svg';

import {ReactComponent as ArrowRedoOutlinedIcon} from 'assets/images/icons/arrow-redo-outline.svg';
import {ReactComponent as HeartPurpleIcon} from 'assets/images/icons/heart-purple.svg';
import {ReactComponent as HeartEmptyIcon} from 'assets/images/icons/heart-empty.svg';

interface TradeToolsSectionProps {
  onSend: () => void;
  onReceive: () => void;
  onSwap: () => void;
  onTrade: () => void;
  onBuyCrypto: () => void;
  onShare?: () => void;
  onMakeFavorite?: () => void;
  isFavorite?: boolean;
}

const useStyles = makeStyles((theme) => ({
  icon: {
    height: theme.spacing(6),
    width: theme.spacing(6),
  },
}));

export const TradeToolsSection = (props: TradeToolsSectionProps) => {
  const {
    onSend,
    onReceive,
    onSwap,
    onTrade,
    onBuyCrypto,
    onShare,
    onMakeFavorite,
    isFavorite,
  } = props;

  const classes = useStyles();

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box p={4}>
      <Grid container spacing={4}>
        {isMobile ? (
          <Grid item xs={12}>
            <Typography variant='h6'>Trade tools</Typography>
          </Grid>
        ) : null}

        {onMakeFavorite ? (
          <Grid item>
            <Box display='flex' flexDirection='column' alignItems='center'>
              <RoundedIconButton
                style={isFavorite ? {borderColor: '#F76F8E'} : undefined}
                onClick={onMakeFavorite}>
                {isFavorite ? (
                  <HeartPurpleIcon className={classes.icon} />
                ) : (
                  <HeartEmptyIcon className={classes.icon} />
                )}
              </RoundedIconButton>
              <Typography variant='caption'>Favorite</Typography>
            </Box>
          </Grid>
        ) : null}

        {onShare ? (
          <Grid item>
            <Box display='flex' flexDirection='column' alignItems='center'>
              <RoundedIconButton onClick={onShare}>
                <ArrowRedoOutlinedIcon className={classes.icon} />
              </RoundedIconButton>
              <Typography variant='caption'>Share</Typography>
            </Box>
          </Grid>
        ) : null}
        <Grid item>
          <Box display='flex' flexDirection='column' alignItems='center'>
            <RoundedIconButton onClick={onTrade}>
              <BitcoinConvertWhiteIcon className={classes.icon} />
            </RoundedIconButton>
            <Typography variant='caption'>Trade</Typography>
          </Box>
        </Grid>
        <Grid item>
          <Box display='flex' flexDirection='column' alignItems='center'>
            <RoundedIconButton onClick={onSwap}>
              <MoneySendIcon className={classes.icon} />
            </RoundedIconButton>
            <Typography variant='caption'>Swap</Typography>
          </Box>
        </Grid>
        <Grid item>
          <Box display='flex' flexDirection='column' alignItems='center'>
            <RoundedIconButton onClick={onSend}>
              <ExportWhiteIcon className={classes.icon} />
            </RoundedIconButton>
            <Typography variant='caption'>Send</Typography>
          </Box>
        </Grid>
        <Grid item>
          <Box display='flex' flexDirection='column' alignItems='center'>
            <RoundedIconButton onClick={onReceive}>
              <ImportWhiteIcon className={classes.icon} />
            </RoundedIconButton>

            <Typography variant='caption'>Receive</Typography>
          </Box>
        </Grid>
        <Grid item>
          <Box display='flex' flexDirection='column' alignItems='center'>
            <RoundedIconButton onClick={onBuyCrypto}>
              <AddCircleIcon className={classes.icon} />
            </RoundedIconButton>
            <Typography variant='caption'>Buy Crypto</Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
