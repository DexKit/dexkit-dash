import React, {useCallback, useState} from 'react';

import {useDispatch, useSelector} from 'react-redux';
import {Badge, makeStyles} from '@material-ui/core';

import {AppState} from 'redux/store';

import AppBarButton from 'shared/components/AppBar/AppBarButton';
import {NotificationsDialog} from 'shared/components/NotificationsDialog';

import {NotificationOutlinedIcon} from 'shared/components/Icons';
import {onSeenNotification} from 'redux/_notification/actions';

const useStyles = makeStyles((theme) => ({
  icon: {
    '& path': {
      stroke: theme.palette.text.primary,
    },
  },
}));

interface NotificationsProps {}

const Notifications: React.FC<NotificationsProps> = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const {notificationsNotSeen} = useSelector<
    AppState,
    AppState['notification']
  >(({notification}) => notification);

  const [showNotifications, setShowNotifications] = useState(false);

  const handleToggleNotifications = useCallback(() => {
    setShowNotifications((value) => !value);
    dispatch(onSeenNotification());
  }, [dispatch]);

  return (
    <>
      <NotificationsDialog
        open={showNotifications}
        onClose={handleToggleNotifications}
      />
      <AppBarButton onClick={handleToggleNotifications}>
        <Badge badgeContent={notificationsNotSeen} color='primary'>
          <NotificationOutlinedIcon className={classes.icon} />
        </Badge>
      </AppBarButton>
    </>
  );
};

export default Notifications;
