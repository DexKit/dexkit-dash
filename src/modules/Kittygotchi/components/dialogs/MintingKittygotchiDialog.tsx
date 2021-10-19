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
  makeStyles,
} from '@material-ui/core';
import React, {useCallback} from 'react';
import {ErrorIcon, SuccessIcon} from 'shared/components/Icons';

import {useWeb3} from 'hooks/useWeb3';
import {getTransactionScannerUrl} from 'utils/blockchain';
import {useHistory} from 'react-router';

const useStyles = makeStyles((theme) => ({
  kittygotchiImage: {
    width: theme.spacing(40),
    height: theme.spacing(40),
  },
}));

interface Props {
  loading?: boolean;
  error?: string;
  done?: boolean;
  transactionHash?: string;
  dialogProps: DialogProps;
  onTryAgain?: () => void;
  tokenId?: number;
}

export const MintingKittygotchiDialog = (props: Props) => {
  const {
    dialogProps,
    loading,
    error,
    done,
    transactionHash,
    onTryAgain,
    tokenId,
  } = props;

  const {chainId} = useWeb3();

  const classes = useStyles();
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

  const history = useHistory();

  const handleViewKittygotchi = useCallback(() => {
    history.push(`/kittygotchi/${tokenId}`);
  }, [history, tokenId]);

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
                  Creating your kittygotchi
                </Typography>
                <Typography
                  align='center'
                  variant='body1'
                  color='textSecondary'>
                  Please, wait for transaction confirmation.
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
                  <img
                    src={require('assets/images/default-kittygotchi.png')}
                    className={classes.kittygotchiImage}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography gutterBottom align='center' variant='h6'>
                  Kittygotchi created
                </Typography>
                <Typography
                  align='center'
                  variant='body1'
                  color='textSecondary'>
                  You can feed your kittygotchi every 24h
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Button
                  color='primary'
                  variant='outlined'
                  onClick={handleViewKittygotchi}
                  fullWidth>
                  View Kittygotchi #{tokenId}
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button onClick={handleClose} color='primary' fullWidth>
                  Close
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

export default MintingKittygotchiDialog;
