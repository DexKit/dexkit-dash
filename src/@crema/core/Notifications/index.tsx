import React, {useCallback, useState} from 'react';

import {useSelector} from 'react-redux';
import {Badge} from '@material-ui/core';

import {AppState} from 'redux/store';

import {ReactComponent as NotificationIcon} from 'assets/images/icons/notification.svg';
import AppBarButton from 'shared/components/AppBar/AppBarButton';
import {NotificationsDialog} from 'shared/components/NotificationsDialog';

interface NotificationsProps {}

const Notifications: React.FC<NotificationsProps> = () => {
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
          color='secondary'>
          <NotificationIcon />
        </Badge>
      </AppBarButton>
    </>
  );
};

export default Notifications;
