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
import {SQUIDLEAGUE_ROUTE} from 'shared/constants/routes';

interface Props {
  dialogProps: DialogProps;
  loading: boolean;
  errorMessage?: string;
  transactionHash?: string;
  onConfirm: () => void;
  confirmed: boolean;
  gameId?: number;
}

export const JoinGameDialog: React.FC<Props> = ({
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
  const {chainId} = useWeb3();
  const {getTransactionScannerUrl} = useChainInfo();
  const intl = useIntl();

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
    history.push(`${SQUIDLEAGUE_ROUTE}/${gameId}`);
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
              <IntlMessages
                id='squidLeague.transactionFailed'
                defaultMessage={'Transaction Failed'}
              />
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
            <IntlMessages id='squidLeague.transactionConfirmed' />
          </Typography>
          <Typography color='textSecondary' align='center' variant='body1'>
            <IntlMessages
              id='squidLeague.yourTransactionWasConfirmed'
              defaultMessage={'Transaction was confirmed'}
            />
          </Typography>
        </Grid>
        {gameId !== undefined && (
          <Grid item>
            <Button
              variant='contained'
              color='primary'
              onClick={handleGoToGame}
              fullWidth>
              <IntlMessages
                id='squidLeague.goToGame'
                defaultMessage={'Go to Game'}
              />
            </Button>
          </Grid>
        )}
        {transactionHash && (
          <Grid item>
            <Button color='primary' onClick={handleViewTransaction} fullWidth>
              <IntlMessages
                id='squidLeague.viewTransaction'
                defaultMessage={'View Transaction'}
              />
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
              <IntlMessages
                id='squidLeague.joinGame'
                defaultMessage={'Join Game'}
              />
            </Typography>
            <Typography align='center' variant='body1' color='textSecondary'>
              <IntlMessages
                id='squidLeague.pleaseWaitnforTransactionConfirmation'
                defaultMessage={'Please Wait for Transaction Confirmation'}
              />
            </Typography>
          </Grid>
          {transactionHash ? (
            <Grid item xs={12}>
              <Button color='primary' onClick={handleViewTransaction} fullWidth>
                <IntlMessages
                  id='squidLeague.viewTransaction'
                  defaultMessage={'View Transaction'}
                />
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
        title={intl.formatMessage({
          id: 'squidLeague.joinGame',
          defaultMessage: 'Join Game',
        })}
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
              <IntlMessages
                id='squidLeague.joinGame'
                defaultMessage='Join Game'
              />
            </Typography>
            <Typography align='center' variant='body1'>
              <IntlMessages
                id='squidLeague.doYouWantToJoinAGame'
                defaultMessage='Do you want to join a game?'
              />
            </Typography>
          </Box>
        )}
      </DialogContent>
      {!loading && !confirmed && errorMessage === undefined ? (
        <>
          <Divider />
          <DialogActions>
            <Button onClick={onConfirm} color='primary' variant='contained'>
              <IntlMessages
                id='squidLeague.confirm'
                defaultMessage={'Confirm'}
              />{' '}
            </Button>
            <Button onClick={handleClose}>
              <IntlMessages id='squidLeague.cancel' defaultMessage={'Cancel'} />
            </Button>
          </DialogActions>
        </>
      ) : null}
    </Dialog>
  );
};

export default JoinGameDialog;
