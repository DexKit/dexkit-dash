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
import {useChainInfo} from 'hooks/useChainInfo';

import {useWeb3} from 'hooks/useWeb3';
import IntlMessages from '@crema/utility/IntlMessages';

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

  const {getTransactionScannerUrl} = useChainInfo();

  const theme = useTheme();

  const handleClose = useCallback(() => {
    if (dialogProps.onClose) {
      dialogProps.onClose({}, 'backdropClick');
    }
  }, [dialogProps]);

  const handleViewTransaction = useCallback(() => {
    if (chainId && transactionHash) {
      window.open(getTransactionScannerUrl(chainId, transactionHash), '_blank');
    }
  }, [chainId, transactionHash, getTransactionScannerUrl]);

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
                  <IntlMessages id='app.kittygotchi.feedingYour' />
                </Typography>
                <Typography
                  align='center'
                  variant='body1'
                  color='textSecondary'>
                  <IntlMessages id='app.kittygotchi.pleaseSign' />
                </Typography>
              </Grid>
              {transactionHash ? (
                <Grid item xs={12}>
                  <Button
                    color='primary'
                    onClick={handleViewTransaction}
                    fullWidth>
                    <IntlMessages id='app.kittygotchi.viewTransaction' />
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
                  <IntlMessages id='app.kittygotchi.fed' />
                </Typography>
                <Typography
                  align='center'
                  variant='body1'
                  color='textSecondary'>
                  <IntlMessages id='app.kittygotchi.keepComing' />{' '}
                  <IntlMessages id='app.kittygotchi.every24' />
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant='outlined'
                  color='primary'
                  onClick={handleViewTransaction}
                  fullWidth>
                  <IntlMessages id='app.kittygotchi.viewTransaction' />
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button onClick={handleClose} color='primary' fullWidth>
                  <IntlMessages id='app.kittygotchi.close' />
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
                  <IntlMessages id='app.kittygotchi.transactionFailed' />
                </Typography>
                <Typography
                  align='center'
                  variant='body1'
                  color='textSecondary'>
                  <IntlMessages id='app.kittygotchi.pleaseTry' />
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant='contained'
                  onClick={onTryAgain}
                  color='primary'
                  fullWidth>
                  <IntlMessages id='app.kittygotchi.tryAgain' />
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button onClick={handleClose} color='primary' fullWidth>
                  <IntlMessages id='app.kittygotchi.close' />
                </Button>
              </Grid>
            </Grid>
          ) : null}
        </Box>
      </DialogContent>
    </Dialog>
  );
};
