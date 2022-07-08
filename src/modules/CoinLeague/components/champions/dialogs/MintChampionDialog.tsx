import React, {useCallback} from 'react';

import IntlMessages from '@crema/utility/IntlMessages';

import {
  Dialog,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Button,
  Divider,
  Box,
  Grid,
  IconButton,
  Typography,
  makeStyles,
  useTheme,
} from '@material-ui/core';

import {Skeleton} from '@material-ui/lab';

import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';

import {useLeaguesChainInfo} from 'modules/CoinLeague/hooks/useLeaguesChainInfo';
import {ErrorIcon} from 'shared/components/Icons';
import {useChampionMetadata} from 'modules/CoinLeague/hooks/champions';
import {getNormalizedUrl} from 'utils/browser';
import ChampionTrait from '../ChampionTrait';
import {getTransactionScannerUrl} from 'utils/blockchain';

const useStyles = makeStyles((theme) => ({
  tokenImage: {
    width: theme.spacing(32),
    height: theme.spacing(32),
  },
}));

interface MintChampionDialogProps {
  dialogProps: DialogProps;
  error?: any;
  loading?: boolean;
  onConfirm?: () => void;
  tokenId?: string;
  onTryAgain?: () => void;
  transactionHash?: string;
}

export const MintChampionDialog = (props: MintChampionDialogProps) => {
  const {
    dialogProps,
    error,
    loading,
    onConfirm,
    onTryAgain,
    tokenId,
    transactionHash,
  } = props;

  const classes = useStyles();

  const theme = useTheme();

  const championMetadata = useChampionMetadata(tokenId);

  const handleClose = useCallback(() => {
    if (dialogProps.onClose) {
      dialogProps.onClose({}, 'backdropClick');
      championMetadata.clear();
    }
  }, [championMetadata, dialogProps]);

  const {chainId} = useLeaguesChainInfo();

  const handleViewTransaction = useCallback(() => {
    if (chainId && transactionHash) {
      window.open(getTransactionScannerUrl(chainId, transactionHash), '_blank');
    }
  }, [chainId, transactionHash]);

  const handleTryAgain = useCallback(() => {
    if (tokenId) {
      championMetadata.fetch(tokenId);
    }
  }, [championMetadata, tokenId]);

  const renderError = () => {
    return (
      <Box py={4}>
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
            <Typography align='center' variant='body1' color='textSecondary'>
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
      </Box>
    );
  };

  const renderLoading = () => {
    return (
      <Box py={4}>
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
              Creating your Champion
            </Typography>
            <Typography align='center' variant='body1' color='textSecondary'>
              Please, wait for transaction confirmation.
            </Typography>
          </Grid>
          {transactionHash ? (
            <Grid item xs={12}>
              <Button color='primary' onClick={handleViewTransaction} fullWidth>
                View transaction
              </Button>
            </Grid>
          ) : null}
        </Grid>
      </Box>
    );
  };

  const renderDefault = () => {
    return (
      <Box py={4}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography align='center' variant='h6'>
              Create a Coin League Champion
            </Typography>
            <Typography color='textSecondary' align='center' variant='body1'>
              Do you want to create a Champion?
            </Typography>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderCreated = () => {
    return (
      <Box py={4}>
        <Grid container spacing={4}>
          {!championMetadata.error ? (
            <Grid item xs={12}>
              <Box
                display='flex'
                alignItems='center'
                alignContent='center'
                justifyContent='center'>
                {championMetadata.loading ? (
                  <Skeleton variant='rect' className={classes.tokenImage} />
                ) : (
                  <img
                    alt=''
                    src={
                      championMetadata.data?.image
                        ? getNormalizedUrl(championMetadata.data?.image)
                        : ''
                    }
                    className={classes.tokenImage}
                  />
                )}
              </Box>
            </Grid>
          ) : (
            <>
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
                <Typography variant='h6' align='center'>
                  Error while loading metadata
                </Typography>
                <Typography
                  color='textSecondary'
                  variant='body1'
                  align='center'>
                  Please, try again later
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Button
                  onClick={handleTryAgain}
                  fullWidth
                  variant='contained'
                  color='primary'>
                  Try again
                </Button>
              </Grid>
            </>
          )}

          {!championMetadata.loading ? (
            <Grid item xs={12}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Typography align='center' variant='h6'>
                    {championMetadata.data?.name}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={4}>
                    {championMetadata.data?.attributes.map(
                      (attr, index: number) => (
                        <Grid item xs={4} key={index}>
                          <ChampionTrait
                            traitType={attr.trait_type}
                            value={attr.value}
                          />
                        </Grid>
                      ),
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ) : !championMetadata.error ? (
            <Grid item xs={12}>
              <Typography align='center' variant='h6'>
                Loading Champion
              </Typography>
              <Typography align='center' variant='body1'>
                We are loading your champion information.
              </Typography>
            </Grid>
          ) : null}

          <Grid item xs={12}>
            <Button
              onClick={handleClose}
              startIcon={<CloseIcon />}
              fullWidth
              color='primary'>
              Close
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <Dialog {...dialogProps} onClose={handleClose} maxWidth='xs' fullWidth>
      <DialogTitle>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Box display='flex' alignItems='center' alignContent='center'>
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'
              alignContent='center'
              mr={2}
            />
            <Typography variant='body1'>
              <IntlMessages id='app.coinLeagues.createChampion' />
            </Typography>
          </Box>
          <Box>
            <IconButton size='small' onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        {tokenId && transactionHash ? (
          renderCreated()
        ) : (
          <>
            {error
              ? renderError()
              : loading
              ? renderLoading()
              : renderDefault()}
          </>
        )}
      </DialogContent>
      {!error && !loading && !tokenId && !transactionHash ? (
        <>
          <Divider />
          <DialogActions>
            <Button
              startIcon={<CheckIcon />}
              onClick={onConfirm}
              variant='contained'
              color='primary'>
              <IntlMessages id='app.coinLeagues.confirm' />
            </Button>
            <Button startIcon={<CloseIcon />} onClick={handleClose}>
              <IntlMessages id='app.coinLeagues.cancel' />{' '}
            </Button>
          </DialogActions>
        </>
      ) : null}
    </Dialog>
  );
};

export default MintChampionDialog;
