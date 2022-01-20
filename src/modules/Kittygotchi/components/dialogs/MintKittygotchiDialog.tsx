import React, {useCallback} from 'react';
import {
  DialogProps,
  Dialog,
  DialogContent,
  Box,
  DialogActions,
  Button,
  Grid,
  useTheme,
  CircularProgress,
  Typography,
  DialogTitle,
  makeStyles,
  IconButton,
} from '@material-ui/core';

import {Alert} from '@material-ui/lab';

import DoneIcon from '@material-ui/icons/Done';
import CancelIcon from '@material-ui/icons/Cancel';

import CloseIcon from '@material-ui/icons/Close';

import GavelIcon from '@material-ui/icons/Gavel';
import {useWeb3} from 'hooks/useWeb3';
import {ethers} from 'ethers';

import IntlMessages from '@crema/utility/IntlMessages';
import {
  GET_KITTYGOTCHI_CHAIN_SYMBOL,
  GET_KITTYGOTCHI_MINT_RATE,
  isKittygotchiNetworkSupported,
} from 'modules/Kittygotchi/utils';

const useStyles = makeStyles((theme) => ({
  icon: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
  content: {
    margin: 0,
    padding: 0,
  },
}));

interface MintKittygotchiDialogProps {
  dialogProps: DialogProps;
  onConfirm?: () => void;
  loading?: boolean;
}

export const MintKittygotchiDialog = (props: MintKittygotchiDialogProps) => {
  const {dialogProps, loading, onConfirm} = props;
  const {onClose} = dialogProps;

  const {chainId} = useWeb3();

  const classes = useStyles();

  const handleClose = useCallback(
    (e) => {
      if (onClose) {
        onClose({}, 'backdropClick');
      }
    },
    [onClose],
  );

  const theme = useTheme();

  return (
    <Dialog {...dialogProps} maxWidth='xs' fullWidth>
      <DialogTitle>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Box display='flex' alignItems='center' alignContent='center'>
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'
              alignContent='center'
              mr={2}>
              <GavelIcon className={classes.icon} />
            </Box>
            <Typography variant='body1'>
              <IntlMessages id='app.kittygotchi.creating' />
            </Typography>
          </Box>
          <Box>
            <IconButton disabled={loading} size='small' onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent dividers className={classes.content}>
        {!isKittygotchiNetworkSupported(chainId) ? (
          <Box p={4}>
            <Alert severity='info'>
              <Typography variant='body2'>
                <IntlMessages id='app.kittygotchi.connectTo' />{' '}
                <strong>Polygon(MATIC)</strong>{' '}
                <IntlMessages id='app.kittygotchi.netToCreateKitty' />
              </Typography>
            </Alert>
          </Box>
        ) : null}
        <Box p={4}>
          {loading ? (
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography gutterBottom align='center' variant='h6'>
                  <IntlMessages id='app.kittygotchi.creating' />
                </Typography>
                <Typography
                  color='textSecondary'
                  align='center'
                  variant='body1'>
                  <IntlMessages id='app.kittygotchi.pleaseSign' />
                </Typography>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography gutterBottom align='center' variant='h6'>
                  <IntlMessages id='app.kittygotchi.creatingYour' />
                </Typography>
                <Typography
                  color='textSecondary'
                  align='center'
                  variant='body1'>
                  <IntlMessages id='app.kittygotchi.willNeed' />{' '}
                  <strong>
                    {ethers.utils.formatEther(
                      GET_KITTYGOTCHI_MINT_RATE(chainId),
                    )}{' '}
                    {GET_KITTYGOTCHI_CHAIN_SYMBOL(chainId)}
                  </strong>{' '}
                  <IntlMessages id='app.kittygotchi.tokensInYourWallet' />
                </Typography>
              </Grid>
            </Grid>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          startIcon={
            loading ? (
              <CircularProgress color='inherit' size={theme.spacing(6)} />
            ) : (
              <DoneIcon />
            )
          }
          onClick={onConfirm}
          color='primary'
          variant='contained'
          disabled={loading}>
          <IntlMessages id='app.kittygotchi.confirm' />
        </Button>
        <Button
          disabled={loading}
          onClick={handleClose}
          startIcon={<CancelIcon />}>
          <IntlMessages id='app.kittygotchi.cancel' />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MintKittygotchiDialog;
