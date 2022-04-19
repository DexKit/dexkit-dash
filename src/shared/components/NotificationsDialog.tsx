import React, {useCallback, useState} from 'react';

import {useSnackbar} from 'notistack';

import {ReactComponent as NotificationIcon} from 'assets/images/menu/notification.svg';

import {
  Grid,
  DialogProps,
  Button,
  Dialog,
  Box,
  IconButton,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
  makeStyles,
  Menu,
  MenuItem,
  ListItemIcon,
} from '@material-ui/core';
import NotificationItem from '@crema/core/Notifications/NotificationItem';
import {AppState} from 'redux/store';
import {useDispatch, useSelector} from 'react-redux';
import CloseIcon from '@material-ui/icons/Close';
import {NotificationOutlinedIcon} from './Icons';
import {useMobile} from 'hooks/useMobile';
import {useIntl} from 'react-intl';
import IntlMessages from '@crema/utility/IntlMessages';
import {groupItems} from 'utils';
import {humanizeDate} from 'utils/date';
import {Delete} from '@material-ui/icons';
import {onRemoveNotification} from 'redux/actions';

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

  const notificationsState = useSelector<AppState, AppState['notification']>(
    ({notification}) => notification,
  );

  const notifications = notificationsState.notifications.map((n, index) => ({
    ...n,
    id: index,
  }));

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

  const dispatch = useDispatch();

  const canEnableNotifications = useCallback(() => {
    return false;
  }, []);

  const handleClickNotification = useCallback(() => {}, []);

  const [anchor, setAnchor] = useState<HTMLElement>();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>();

  const handleToggleMenu = useCallback(
    (index: number, anchor: HTMLElement | null) => {
      setMenuOpen((value) => !value);
      setSelectedIndex(index);

      if (anchor !== null) {
        setAnchor(anchor);
      }
    },
    [],
  );

  const handleRemove = useCallback(() => {
    if (selectedIndex !== undefined) {
      dispatch(onRemoveNotification(selectedIndex));
      setSelectedIndex(undefined);
      setAnchor(undefined);
      setMenuOpen(false);
    }
  }, [dispatch, selectedIndex]);

  const handleCloseMenu = useCallback(() => {
    setSelectedIndex(undefined);
    setAnchor(undefined);
    setMenuOpen(false);
  }, []);

  return (
    <>
      <Menu open={menuOpen} anchorEl={anchor} onClose={handleCloseMenu}>
        <MenuItem onClick={handleRemove}>
          <ListItemIcon>
            <Delete fontSize='small' />
          </ListItemIcon>
          <Typography variant='inherit'>
            <IntlMessages id='common.remove' defaultMessage='Remove' />
          </Typography>
        </MenuItem>
      </Menu>
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
            <Box py={4}>
              {groupItems(notifications).map((group, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  <Box px={4} py={2}>
                    <Typography color='primary' variant='body1'>
                      {humanizeDate(group.date)}
                    </Typography>
                  </Box>
                  {group.items.map((item: any, itemIndex: number) => (
                    <NotificationItem
                      onClick={handleClickNotification}
                      id={item.id}
                      key={itemIndex}
                      item={item}
                      onMenu={handleToggleMenu}
                    />
                  ))}
                </React.Fragment>
              ))}
            </Box>
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
                  <NotificationIcon />
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant='body1'
                    color='textSecondary'
                    align='center'>
                    <IntlMessages
                      id='common.nothingToSeeHere'
                      defaultMessage='Nothing to See Here'
                    />
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NotificationsDialog;
