import React from 'react';
import IntlMessages from '@crema/utility/IntlMessages';
import {
  Button,
  DialogActions,
  Dialog,
  DialogContent,
  DialogProps,
  Box,
  Grid,
  CircularProgress,
  useTheme,
  Typography,
  Divider,
} from '@material-ui/core';
import {useChainInfo} from 'hooks/useChainInfo';
import {useWeb3} from 'hooks/useWeb3';
import {useCallback} from 'react';
import CustomDialogTitle from 'shared/components/CustomDialogTitle';
import {useIntl} from 'react-intl';
import AddIcon from '@material-ui/icons/Add';
import {ErrorIcon, SuccessIcon} from 'shared/components/Icons';
import {useHistory} from 'react-router';

interface Props {
  dialogProps: DialogProps;
  loading: boolean;
  errorMessage?: string;
  transactionHash?: string;
  onConfirm: () => void;
  confirmed: boolean;
  gameId?: number;
}

export const CreateGameDialog: React.FC<Props> = ({
  dialogProps,
  loading,
  transactionHash,
  onConfirm,
  confirmed,
  errorMessage,
  gameId,
}) => {
  const history = useHistory();
  const {onClose} = dialogProps;
  const {messages} = useIntl();
  const {chainId} = useWeb3();
  const {getTransactionScannerUrl} = useChainInfo();

  const theme = useTheme();

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  }, [onClose]);

  const handleViewTransaction = useCallback(() => {
    if (chainId && transactionHash) {
      window.open(getTransactionScannerUrl(chainId, transactionHash), '_blank');
    }
  }, [chainId, transactionHash]);

  const handleGoToGame = useCallback(() => {
    history.push(`/nft-league/${gameId}`);
  }, [gameId, history]);

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
        {gameId !== undefined && (
          <Grid item>
            <Button
              variant='contained'
              color='primary'
              onClick={handleGoToGame}
              fullWidth>
              <IntlMessages id='nftLeague.goToGame' />
            </Button>
          </Grid>
        )}
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
              <IntlMessages id='nftLeague.creatingGame' />
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

  return (
    <Dialog {...dialogProps}>
      <CustomDialogTitle
        title={messages['nftLeague.createGame'] as string}
        icon={<AddIcon />}
        onClose={handleClose}
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

export default CreateGameDialog;
