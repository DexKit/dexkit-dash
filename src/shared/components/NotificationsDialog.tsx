import React, {useCallback} from 'react';

import {
  Grid,
  DialogProps,
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
import CustomDialogTitle from './CustomDialogTitle';
import {useIntl} from 'react-intl';

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
  const {messages} = useIntl();
  return (
    <Dialog {...props} fullWidth maxWidth='sm'>
      <CustomDialogTitle
        title={messages['app.shared.notifications']}
        icon={<NotificationOutlinedIcon className={classes.icon} />}
        onClose={handleClose}
      />

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
