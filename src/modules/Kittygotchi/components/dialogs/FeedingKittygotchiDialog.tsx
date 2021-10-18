import {
  Box,
  Button,
  DialogProps,
  Dialog,
  DialogContent,
  Grid,
  CircularProgress,
  useTheme,
  Typography,
} from '@material-ui/core';
import React, {useCallback} from 'react';
import {ErrorIcon, SuccessIcon} from 'shared/components/Icons';

import {useWeb3} from 'hooks/useWeb3';
import {getTransactionScannerUrl} from 'utils/blockchain';

interface Props {
  loading?: boolean;
  error?: string;
  done?: boolean;
  transactionHash?: string;
  dialogProps: DialogProps;
  onTryAgain?: () => void;
}

export const FeedingKittygotchiDialog = (props: Props) => {
  const {dialogProps, loading, error, done, transactionHash, onTryAgain} =
    props;

  const {chainId} = useWeb3();

  const theme = useTheme();

  const handleClose = useCallback(() => {
    if (dialogProps.onClose) {
      dialogProps.onClose({}, 'backdropClick');
    }
  }, [dialogProps.onClose]);

  const handleViewTransaction = useCallback(() => {
    if (chainId && transactionHash) {
      window.open(getTransactionScannerUrl(chainId, transactionHash), '_blank');
    }
  }, [chainId, transactionHash]);

  return (
    <Dialog {...dialogProps} onClose={handleClose} fullWidth maxWidth='xs'>
      <DialogContent>
        <Box py={4}>
          {loading ? (
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Box
                  display='flex'
                  alignItems='center'
                  alignContent='center'
                  justifyContent='center'>
                  <CircularProgress color='primary' size={theme.spacing(24)} />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography align='center' variant='h6'>
                  Feeding your kittygotchi
                </Typography>
                <Typography
                  align='center'
                  variant='body1'
                  color='textSecondary'>
                  Please, sign the transaction in your wallet and wait for
                  confirmation.
                </Typography>
              </Grid>
              {transactionHash ? (
                <Grid item xs={12}>
                  <Button
                    color='primary'
                    onClick={handleViewTransaction}
                    fullWidth>
                    View transaction
                  </Button>
                </Grid>
              ) : null}
            </Grid>
          ) : null}
          {done ? (
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Box
                  display='flex'
                  alignItems='center'
                  alignContent='center'
                  justifyContent='center'>
                  <SuccessIcon />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography gutterBottom align='center' variant='h6'>
                  Kittygotchi Fed
                </Typography>
                <Typography
                  align='center'
                  variant='body1'
                  color='textSecondary'>
                  Keep coming back to feed your kittygotchi every 24h
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant='outlined'
                  onClick={handleClose}
                  color='primary'
                  fullWidth>
                  Close
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  color='primary'
                  onClick={handleViewTransaction}
                  fullWidth>
                  View transaction
                </Button>
              </Grid>
            </Grid>
          ) : null}
          {error ? (
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Box
                  display='flex'
                  alignItems='center'
                  alignContent='center'
                  justifyContent='center'>
                  <ErrorIcon />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography gutterBottom align='center' variant='h6'>
                  Transaction failed
                </Typography>
                <Typography
                  align='center'
                  variant='body1'
                  color='textSecondary'>
                  Please, try again in a few seconds.
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant='contained'
                  onClick={onTryAgain}
                  color='primary'
                  fullWidth>
                  Try again
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button onClick={handleClose} color='primary' fullWidth>
                  Close
                </Button>
              </Grid>
            </Grid>
          ) : null}
        </Box>
      </DialogContent>
    </Dialog>
  );
};
