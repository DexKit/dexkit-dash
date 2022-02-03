import React, {useCallback} from 'react';

import {useSnackbar} from 'notistack';

import {
  Grid,
  DialogProps,
  Button,
  Dialog,
  Box,
  IconButton,
  DialogContent,
  DialogTitle,
  List,
  Divider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import NotificationItem from '@crema/core/Notifications/NotificationItem';
import {AppState} from 'redux/store';
import {useSelector} from 'react-redux';
import CloseIcon from '@material-ui/icons/Close';
import {ConnectivityImage, NotificationOutlinedIcon} from './Icons';
import {useMobile} from 'hooks/useMobile';
import {useIntl} from 'react-intl';
import IntlMessages from '@crema/utility/IntlMessages';

const useStyles = makeStyles((theme) => ({
  icon: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
  noPadding: {
    padding: 0,
  },
}));

interface NotificationsDialogProps extends DialogProps {}

export const NotificationsDialog = (props: NotificationsDialogProps) => {
  const {onClose} = props;

  const {enqueueSnackbar} = useSnackbar();

  const {messages} = useIntl();

  const classes = useStyles();

  const {notifications} = useSelector<AppState, AppState['notification']>(
    ({notification}) => notification,
  );

  const handleClick = useCallback(() => {}, []);

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  }, [onClose]);

  const handleNotifyMe = useCallback(() => {
    if (!('Notification' in window)) {
      return;
    }

    window.Notification.requestPermission().then(function (permission: string) {
      // If the user accepts, let's create a notification

      if (permission === 'granted') {
        new Notification(messages['app.common.notificationsEnabled'] as string);
      } else {
        enqueueSnackbar(messages['app.common.notificationsEnabled'] as string, {
          variant: 'success',
          anchorOrigin: {horizontal: 'right', vertical: 'top'},
        });
      }
    });
  }, [enqueueSnackbar, messages]);

  const isMobile = useMobile();

  const canEnableNotifications = useCallback(() => {
    return false;
  }, []);

  return (
    <Dialog {...props} fullScreen={isMobile} fullWidth maxWidth='sm'>
      <DialogTitle>
        <Box
          display='flex'
          alignItems='center'
          alignContent='center'
          justifyContent='space-between'>
          <Box display='flex' alignItems='center' alignContent='center'>
            <Box
              display='flex'
              alignItems='center'
              alignContent='center'
              mr={2}>
              <NotificationOutlinedIcon className={classes.icon} />
            </Box>
            <Typography variant='body1'>Notifications</Typography>
          </Box>
          <Box></Box>
          <IconButton onClick={handleClose} size='small'>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />

      {canEnableNotifications() ? (
        <Box p={4}>
          <Grid
            container
            alignItems='center'
            justifyContent='center'
            direction='column'
            spacing={2}>
            <Grid item>
              <Typography align='center' variant='body1'>
                <IntlMessages id='app.common.pleaseEnableBrowserNotifications' />
              </Typography>
            </Grid>
            <Grid item>
              <Button color='primary' onClick={handleNotifyMe}>
                <IntlMessages id='app.common.enableNotifications' />
              </Button>
            </Grid>
          </Grid>
        </Box>
      ) : null}
      <Divider />
      <DialogContent className={classes.noPadding}>
        {notifications.length > 0 ? (
          <List disablePadding>
            {notifications.map((item, i) => (
              <NotificationItem
                onClick={handleClick}
                id={Number(item?.id || i)}
                key={i}
                item={item}
              />
            ))}
          </List>
        ) : (
          <Box p={4}>
            <Grid
              container
              alignItems='center'
              alignContent='center'
              justify='center'
              direction='column'
              spacing={2}>
              <Grid item xs={12}>
                <ConnectivityImage />
              </Grid>
              <Grid item xs={8}>
                <Typography variant='h5' gutterBottom align='center'>
                  Nothing to see here
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NotificationsDialog;
