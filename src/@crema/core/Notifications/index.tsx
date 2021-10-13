import React, {useEffect, useCallback, useState} from 'react';

import {useDispatch, useSelector} from 'react-redux';
import {makeStyles} from '@material-ui/core';
import { Badge, } from '@material-ui/core';
import {CremaTheme} from 'types/AppContextPropsType';
import {ethers} from 'ethers';
import {NotificationType, TxNotificationMetadata} from 'types/notifications';

import {
  onNotificationList,
  updateNotification,
} from 'redux/_notification/actions';
import {AppState} from 'redux/store';

import {ReactComponent as NotificationIcon} from 'assets/images/icons/notification.svg';
import AppBarButton from 'shared/components/AppBar/AppBarButton';
import {NotificationsDialog} from 'shared/components/NotificationsDialog';

import {isTransactionMined} from 'utils/blockchain';
import {useWeb3} from 'hooks/useWeb3';


interface NotificationsProps {}

const Notifications: React.FC<NotificationsProps> = () => {

  const {getProvider} = useWeb3();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(onNotificationList());
  }, [dispatch]);

  const {notifications} = useSelector<
    AppState,
    AppState['notification']
  >(({notification}) => notification);


  const [showNotifications, setShowNotifications] = useState(false);

  const handleToggleNotifications = useCallback(() => {
    setShowNotifications((value) => !value);
  }, []);

  // trocar pelo useinterval
  useEffect(() => {
    let interval = setInterval(() => {
      let transactionNotifications = notifications.filter((notification) => {
        let isTransaction = notification?.type === NotificationType.TRANSACTION;
        let isPending =
          (notification?.metadata as TxNotificationMetadata)?.status ==
          'pending';
        return isTransaction && isPending;
      });

      for (let notificaiton of transactionNotifications) {
        let metadata = notificaiton.metadata as TxNotificationMetadata;

        isTransactionMined(getProvider(), metadata.transactionHash).then(
          (result: ethers.providers.TransactionReceipt | null) => {
            if (result !== null) {
              if ((result.status || 0) === 1) {
                dispatch(
                  updateNotification({
                    ...notificaiton,
                    metadata: {
                      ...metadata,
                      status: 'done',
                    } as TxNotificationMetadata,
                  }),
                );
              } else if ((result.status || 0) === 0) {
                dispatch(
                  updateNotification({
                    ...notificaiton,
                    metadata: {
                      ...metadata,
                      status: 'failed',
                    } as TxNotificationMetadata,
                  }),
                );
              }
            }
          },
        );
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [notifications]);

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
