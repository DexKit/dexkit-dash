import React, {useCallback} from 'react';

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Divider,
  Grid,
  Typography,
  useTheme,
} from '@material-ui/core';
import {ErrorIcon, SuccessIcon} from 'shared/components/Icons';
import IntlMessages from '@crema/utility/IntlMessages';
import {useWeb3} from 'hooks/useWeb3';
import {useChainInfo} from 'hooks/useChainInfo';
import CustomDialogTitle from 'shared/components/CustomDialogTitle';
import {useIntl} from 'react-intl';
import GroupAddIcon from '@material-ui/icons/GroupAdd';

interface Props {
  dialogProps: DialogProps;
  errorMessage?: string;
  transactionHash?: string;
  gameId?: number;
  loading?: boolean;
  confirmed?: boolean;
  onConfirm: () => void;
}

export const JoinGameDialog: React.FC<Props> = ({
  dialogProps,
  transactionHash,
  errorMessage,
  gameId,
  loading,
  onConfirm,
  confirmed,
}) => {
  const {onClose} = dialogProps;

  const theme = useTheme();
  const {messages} = useIntl();
  const {chainId} = useWeb3();
  const {getTransactionScannerUrl} = useChainInfo();

  const handleViewTransaction = useCallback(() => {
    if (chainId && transactionHash) {
      window.open(getTransactionScannerUrl(chainId, transactionHash), '_blank');
    }
  }, [chainId, transactionHash, getTransactionScannerUrl]);

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  }, [onClose]);

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
              <IntlMessages id='nftLeague.transactionFailed' />
            </Typography>
            <Typography align='center' variant='body1' color='textSecondary'>
              {errorMessage}
            </Typography>
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
            <Typography align='center' variant='h5'>
              <IntlMessages id='nftLeague.joiningGame' />
            </Typography>
            <Typography align='center' variant='body1' color='textSecondary'>
              <IntlMessages id='nftLeague.pleaseWaitnforTransactionConfirmation' />
            </Typography>
          </Grid>
          {transactionHash ? (
            <Grid item xs={12}>
              <Button color='primary' onClick={handleViewTransaction} fullWidth>
                <IntlMessages id='nftLeague.viewTransaction' />
              </Button>
            </Grid>
          ) : null}
        </Grid>
      </Box>
    );
  };

  const renderSuccess = () => {
    return (
      <Grid
        container
        spacing={4}
        direction='column'
        alignItems='center'
        alignContent='center'
        justifyContent='center'>
        <Grid item>
          <Box
            display='flex'
            alignItems='center'
            alignContent='center'
            justifyContent='center'>
            <SuccessIcon />
          </Box>
        </Grid>
        <Grid item>
          <Typography gutterBottom align='center' variant='h5'>
            <IntlMessages id='nftLeague.transactionConfirmed' />
          </Typography>
          <Typography color='textSecondary' align='center' variant='body1'>
            <IntlMessages id='nftLeague.yourTransactionWasConfirmed' />
          </Typography>
        </Grid>
        {transactionHash && (
          <Grid item>
            <Button color='primary' onClick={handleViewTransaction} fullWidth>
              <IntlMessages id='nftLeague.viewTransaction' />
            </Button>
          </Grid>
        )}
      </Grid>
    );
  };

  return (
    <Dialog {...dialogProps}>
      <CustomDialogTitle
        title={messages['nftLeague.joinGame'] as string}
        onClose={handleClose}
        icon={<GroupAddIcon />}
      />
      <Divider />
      <DialogContent>
        {errorMessage ? (
          renderError()
        ) : confirmed ? (
          renderSuccess()
        ) : loading ? (
          renderLoading()
        ) : (
          <Box py={4}>
            <Typography align='center' variant='h5'>
              <IntlMessages id='nftLeague.createGame' />
            </Typography>
            <Typography align='center' variant='body1'>
              <IntlMessages id='nftLeague.doYouWantToCreateAGame' />
            </Typography>
          </Box>
        )}
      </DialogContent>
      {!loading && !confirmed && errorMessage === undefined ? (
        <>
          <Divider />
          <DialogActions>
            <Button onClick={onConfirm} color='primary' variant='contained'>
              <IntlMessages id='nftLeague.confirm' />{' '}
            </Button>
            <Button onClick={handleClose}>
              <IntlMessages id='nftLeague.cancel' />
            </Button>
          </DialogActions>
        </>
      ) : null}
    </Dialog>
  );
};

export default JoinGameDialog;
