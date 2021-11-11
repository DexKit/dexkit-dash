import React, {useEffect, useState} from 'react';

import {useIntl} from 'react-intl';
import IntlMessages from '@crema/utility/IntlMessages';

import {onAddNotification} from 'redux/actions';
import {NotificationType} from 'services/notification';
import {useDispatch} from 'react-redux';
import {Notification} from 'types/models/Notification';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import DeleteIcon from '@material-ui/icons/Delete';
import {useStyles} from './index.style';
import {useContractWrapper} from 'hooks/useContractWrapper';
import {useChainId} from 'hooks/useChainId';
import {SignedOrder} from '@0x/order-utils';
import {getWeb3Wrapper} from 'services/web3modal';

interface OrderProps {
  open: boolean;
  order: SignedOrder;
  onClose: () => void;
}

const CancelOrder: React.FC<OrderProps> = (props) => {
  const {open, order, onClose} = props;
  const {messages} = useIntl();

  const [loading, setLoading] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const isfullScreen = window.innerWidth <= 500;

  const {getContractWrappers} = useContractWrapper();
  const {currentChainId} = useChainId();

  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    if (open) {
      setLoading(false);
      setDone(false);
      setError(undefined);
    }
  }, [open]);

  const handleAction = async () => {
    try {
      setLoading(true);

      const contractWrappers = await getContractWrappers(currentChainId);
      const web3Wrapper = await getWeb3Wrapper();

      if (contractWrappers && web3Wrapper) {
        const tx = await contractWrappers.exchange
          .cancelOrder(order)
          .sendTransactionAsync({
            from: order.makerAddress,
            //gasPrice: 0, /// AQUI GAS
          });
        return web3Wrapper.awaitTransactionSuccessAsync(tx);
      }

      setDone(true);
      setLoading(false);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
        const notification: Notification = {title: 'Error', body: e.message};
        dispatch(onAddNotification([notification], NotificationType.ERROR));
      } else if (typeof error === 'string') {
        setError(e);
        const notification: Notification = {title: 'Error', body: e};
        dispatch(onAddNotification([notification], NotificationType.ERROR));
      }

      setLoading(false);
    }
  };

  let icon;
  let message: string;
  let action;

  if (loading) {
    icon = null;
    message = `${messages['app.dashboard.cancelingYourOrder']}`;
    action = (
      <Button
        style={{margin: 0}}
        fullWidth
        variant='contained'
        color='primary'
        disabled>
        <CircularProgress style={{alignSelf: 'center'}} size='40px' />
      </Button>
    );
  } else if (error) {
    icon = (
      <ErrorOutlineIcon style={{marginBottom: 20, width: 100, height: 100}} />
    );
    message = `${messages['app.dashboard.errorHappened']}: ` + error;
    action = (
      <Button
        style={{margin: 0}}
        fullWidth
        variant='outlined'
        color='primary'
        size='large'
        onClick={onClose}>
        <IntlMessages id='app.dashboard.close' />
      </Button>
    );
  } else if (done) {
    icon = (
      <CheckCircleOutlineIcon
        style={{marginBottom: 20, width: 100, height: 100}}
      />
    );
    message = `${messages['app.dashboard.orderCanceled']}`;
    action = (
      <Button
        style={{margin: 0}}
        fullWidth
        variant='outlined'
        color='primary'
        size='large'
        onClick={onClose}>
        <IntlMessages id='app.dashboard.done' />
      </Button>
    );
  } else {
    icon = <DeleteIcon style={{marginBottom: 20, width: 100, height: 100}} />;
    message = `${messages['app.dashboard.wouldLikeToCancelOrder']}`;
    action = (
      <Button
        style={{margin: 0}}
        fullWidth
        variant='contained'
        color='primary'
        size='large'
        onClick={handleAction}>
        <IntlMessages id='app.dashboard.confirm' />
      </Button>
    );
  }

  return (
    <>
      <Dialog
        fullScreen={isfullScreen}
        fullWidth
        maxWidth='xs'
        scroll='paper'
        open={open}
        onClose={onClose}
        aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title' className={classes.dialogTitle}>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'>
            <Box
              display='flex'
              alignItems='center'
              justifyContent='center'
              style={{width: 48, height: 48}}
            />
            <Typography
              className={classes.textPrimary}
              variant='h5'
              align='center'>
              <IntlMessages id='app.dashboard.cancelOrder' />
            </Typography>
            <Typography align='right'>
              <IconButton aria-label='close' onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent className={classes.dialogContent} dividers>
          <Box
            display='flex'
            flexDirection='column'
            alignContent='center'
            justifyContent='center'>
            <Typography align='center'>{icon}</Typography>

            <Typography variant='h6' align='center'>
              {message}
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions className={classes.dialogActions}>
          {action}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CancelOrder;
