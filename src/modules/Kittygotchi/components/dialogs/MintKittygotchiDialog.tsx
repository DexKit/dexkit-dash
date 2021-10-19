import React, {useCallback, useEffect, useState} from 'react';
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
  Divider,
  IconButton,
} from '@material-ui/core';

import {Alert} from '@material-ui/lab';

import DoneIcon from '@material-ui/icons/Done';
import CancelIcon from '@material-ui/icons/Cancel';

import {GiftIcon, RewardDialogIcon} from 'shared/components/Icons';

import CloseIcon from '@material-ui/icons/Close';

import GavelIcon from '@material-ui/icons/Gavel';
import {useWeb3} from 'hooks/useWeb3';
import {ChainId} from 'types/blockchain';
import {getBalance} from 'services/web3modal';
import {useDefaultAccount} from 'hooks/useDefaultAccount';

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

  const defaultAccount = useDefaultAccount();

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
            <Typography variant='body1'>Minting your Kittygotchi</Typography>
          </Box>
          <Box>
            <IconButton disabled={loading} size='small' onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent dividers className={classes.content}>
        {chainId !== ChainId.Matic && chainId !== ChainId.Mumbai ? (
          <Box p={4}>
            <Alert severity='info'>
              <Typography variant='body2'>
                Connect to <strong>Polygon(MATIC)</strong> network to create a
                Kittygotchi
              </Typography>
            </Alert>
          </Box>
        ) : null}
        <Box p={4}>
          {loading ? (
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography gutterBottom align='center' variant='h6'>
                  Minting your Kittygotchi
                </Typography>
                <Typography
                  color='textSecondary'
                  align='center'
                  variant='body1'>
                  Please, sign the transaction in your wallet and wait for
                  confirmation.
                </Typography>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography gutterBottom align='center' variant='h6'>
                  Creating your Kittygotchi
                </Typography>
                <Typography
                  color='textSecondary'
                  align='center'
                  variant='body1'>
                  You will need <strong>10 MATIC</strong> tokens in your wallet
                  to create one Kittygotchi.
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
          Confirm
        </Button>
        <Button
          disabled={loading}
          onClick={handleClose}
          startIcon={<CancelIcon />}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MintKittygotchiDialog;
