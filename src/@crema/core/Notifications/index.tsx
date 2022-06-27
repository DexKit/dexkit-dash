import React, {useCallback, useState} from 'react';

import {useSelector} from 'react-redux';
import {Badge, makeStyles} from '@material-ui/core';

import {AppState} from 'redux/store';

import AppBarButton from 'shared/components/AppBar/AppBarButton';
import {NotificationsDialog} from 'shared/components/NotificationsDialog';

import {NotificationOutlinedIcon} from 'shared/components/Icons';

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

  const {notifications} = useSelector<AppState, AppState['notification']>(
    ({notification}) => notification,
  );

  const [showNotifications, setShowNotifications] = useState(false);

  const handleToggleNotifications = useCallback(() => {
    setShowNotifications((value) => !value);
  }, []);

  return (
    <>
      <NotificationsDialog
        open={showNotifications}
        onClose={handleToggleNotifications}
      />
      <AppBarButton onClick={handleToggleNotifications}>
        <Badge
          badgeContent={
            notifications.filter(
              (notification) => notification?.check === undefined,
            ).length
          }
          color='primary'>
          <NotificationOutlinedIcon className={classes.icon} />
        </Badge>
      </AppBarButton>
    </>
  );
};

export default Notifications;
