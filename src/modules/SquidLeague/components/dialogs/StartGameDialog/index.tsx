import React, {useState} from 'react';
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
import {useNotifications} from 'hooks/useNotifications';
import {NotificationType, TxNotificationMetadata} from 'types/notifications';
import {useSquidGameCallbacks} from 'modules/SquidLeague/hooks/useSquidGameCallbacks';

interface Props {
  gameAddress: string;
  dialogProps: DialogProps;
}

export const StartGameDialog: React.FC<Props> = ({
  gameAddress,
  dialogProps,
}) => {
  const {onClose} = dialogProps;
  const {chainId} = useWeb3();
  const {onStartChallengeCallback} = useSquidGameCallbacks(gameAddress);

  const {formatMessage} = useIntl();
  const [transactionHash, setTransactionHash] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const {getTransactionScannerUrl} = useChainInfo();
  const {createNotification} = useNotifications();

  const theme = useTheme();

  const onConfirmCallback = useCallback(() => {
    if (!chainId) {
      return;
    }
    setTransactionHash('');

    setLoading(true);
    const onConfirm = () => {
      setLoading(false);
      setConfirmed(true);
    };
    const onSubmit = (tx: string) => {
      setTransactionHash(tx);
      createNotification({
        title: formatMessage({
          id: 'squidLeague.setupGameTitle',
          defaultMessage: `Setup game on squid`,
        }),
        body: formatMessage({
          id: 'squidLeague.setupGameBody',
          defaultMessage: `Setup game on squid`,
        }),
        timestamp: Date.now(),
        url: getTransactionScannerUrl(chainId, tx),
        urlCaption: formatMessage({
          id: 'squidLeague.viewTx',
          defaultMessage: 'View Tx',
        }),
        type: NotificationType.TRANSACTION,
        metadata: {
          chainId: chainId,
          transactionHash: tx,
          status: 'pending',
        } as TxNotificationMetadata,
      });
    };
    const onError = (error: any) => {
      setLoading(false);
      setErrorMessage(error);
      setTransactionHash('');
    };

    onStartChallengeCallback({
      onConfirmation: onConfirm,
      onSubmit: onSubmit,
      onError,
    });
  }, [
    getTransactionScannerUrl,
    chainId,
    createNotification,
    formatMessage,
    onStartChallengeCallback,
  ]);

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  }, [onClose]);

  const handleViewTransaction = useCallback(() => {
    if (chainId && transactionHash) {
      window.open(getTransactionScannerUrl(chainId, transactionHash), '_blank');
    }
  }, [chainId, transactionHash, getTransactionScannerUrl]);

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
              {JSON.stringify(errorMessage)}
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
                id='squidLeague.setupGame'
                defaultMessage={'Setup Game'}
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
        title={formatMessage({
          id: 'squidLeague.setupGame',
          defaultMessage: 'Setup Game',
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
                id='squidLeague.startGame'
                defaultMessage='Start Game'
              />
            </Typography>
            <Typography align='center' variant='body1'>
              <IntlMessages
                id='squidLeague.doYouWantToStartAGame'
                defaultMessage='Do you want to start the game?'
              />
            </Typography>
          </Box>
        )}
      </DialogContent>
      {!loading && !confirmed && errorMessage === undefined ? (
        <>
          <Divider />
          <DialogActions>
            <Button
              onClick={onConfirmCallback}
              color='primary'
              variant='contained'>
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

export default StartGameDialog;
