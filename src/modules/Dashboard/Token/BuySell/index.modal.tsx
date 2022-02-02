import React, {useCallback} from 'react';

import IntlMessages from '@crema/utility/IntlMessages';

import {FEATURE_TRADE_COINS_ZRX} from 'utils/features';

import Box from '@material-ui/core/Box';
import {Grid} from '@material-ui/core';
import Dialog, {DialogProps} from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {Token} from 'types/app';
import {MyBalances} from 'types/blockchain';
import BuySell from '.';
import CloseIcon from '@material-ui/icons/Close';
import {BitcoinConvertWhiteIcon} from 'shared/components/Icons';

import {useWeb3} from 'hooks/useWeb3';

import {useChainInfo} from 'hooks/useChainInfo';

const useStyles = makeStyles((theme) => ({
  icon: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
}));

interface Props extends DialogProps {
  networkName: EthereumNetwork;
  balances: MyBalances[];
  tokenAddress?: string;
  tokenInfo?: Token;
  disableReceive?: boolean;
}

export const BuySellModal = (props: Props) => {
  const {onClose} = props;
  const theme = useTheme();

  const {chainId} = useWeb3();

  const {chainName} = useChainInfo();

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose({}, 'escapeKeyDown');
    }
  }, [onClose]);

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const classes = useStyles();

  return (
    <Dialog
      maxWidth='sm'
      fullWidth
      {...props}
      aria-labelledby='form-dialog-title'
      fullScreen={fullScreen}>
      <DialogTitle id='form-dialog-title'>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Box>
            <Box display='flex' alignItems='center'>
              <Box
                mr={2}
                display='flex'
                alignItems='center'
                justifyContent='center'>
                <BitcoinConvertWhiteIcon className={classes.icon} />
              </Box>

              <Typography variant='body1'>
                <IntlMessages id='app.dashboard.trade' />
              </Typography>
            </Box>
          </Box>
          <IconButton size='small' onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {FEATURE_TRADE_COINS_ZRX(chainId) ? (
          <BuySell {...props} disableLimit />
        ) : (
          <Grid
            container
            spacing={2}
            direction='column'
            alignItems='center'
            alignContent='center'
            justifyContent='center'>
            <Grid item>
              <Typography align='center' variant='h6'>
                {chainName}{' '}
                <IntlMessages id='app.wallet.networkIsNotSupported' />
              </Typography>
            </Grid>
            <Grid item>
              <Typography color='textSecondary' align='center' variant='body2'>
                <IntlMessages id='app.wallet.zeroXDoesNotSupportThisNetworkYet' />
              </Typography>
            </Grid>
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
};
