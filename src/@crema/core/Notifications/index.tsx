import React, {useEffect, useCallback, useState} from 'react';
import clsx from 'clsx';
import {useDispatch, useSelector} from 'react-redux';
import {makeStyles, Popover} from '@material-ui/core';
import {Box, Button, Badge, List, Hidden} from '@material-ui/core';
import {CremaTheme} from 'types/AppContextPropsType';
import {ethers} from 'ethers';
import {NotificationType, TxNotificationMetadata} from 'types/notifications';

import {
  onNotificationList,
  onCheckNotification,
  onCheckAllNotification,
  updateNotification,
} from 'redux/_notification/actions';
import {AppState} from 'redux/store';

import {ReactComponent as NotificationIcon} from 'assets/images/icons/notification.svg';
import AppBarButton from 'shared/components/AppBar/AppBarButton';
import {NotificationsDialog} from 'shared/components/NotificationsDialog';

import {useBlockNumber} from 'hooks/useBlockNumber';
import {isTransactionMined} from 'utils/blockchain';
import {useWeb3} from 'hooks/useWeb3';

const useStyles = makeStyles((theme: CremaTheme) => ({
  crPopover: {
    '& .MuiPopover-paper': {
      width: 260,
      [theme.breakpoints.up('sm')]: {
        width: 300,
      },
      [theme.breakpoints.up('xl')]: {
        width: 380,
      },
    },
    '& .scroll-submenu': {
      maxHeight: 200,
      [theme.breakpoints.up('xl')]: {
        maxHeight: 380,
      },
    },
  },
  btnPopover: {
    borderRadius: 0,
    width: '100%',
    textTransform: 'capitalize',
  },
  notiBtn: {
    justifyContent: 'flex-start',
    width: '100%',
    height: 56,
    fontSize: 16,
    borderRadius: 0,
    paddingLeft: '1rem',
    paddingRight: '1rem',
    color: theme.palette.grey[800],
    '&:hover, &:focus': {
      color: theme.palette.text.primary,
      backgroundColor: 'transparent',
    },
    [theme.breakpoints.up('sm')]: {
      height: 70,
    },
    [theme.breakpoints.up('md')]: {
      justifyContent: 'center',
      width: 'auto',
      color: theme.palette.grey[400],
      '&:hover, &:focus': {
        color: theme.palette.text.primary,
        // backgroundColor: theme.palette.btn.hover,
      },
    },
    [theme.breakpoints.up('lg')]: {
      paddingLeft: '1.5rem',
      paddingRight: '1.5rem',
    },
    [theme.breakpoints.up('xl')]: {
      paddingLeft: '2.5rem',
      paddingRight: '2.5rem',
    },
  },
  notiIcon: {
    fontSize: 22,
    color: theme.palette.grey[400],
    [theme.breakpoints.up('xl')]: {
      fontSize: 30,
    },
  },
  notificationItem: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  list: {
    paddingTop: 0,
    paddingBottom: 0,
  },
}));

interface NotificationsProps {}

const Notifications: React.FC<NotificationsProps> = () => {
  const [anchorNotification, setAnchorNotification] =
    React.useState<HTMLButtonElement | null>(null);

  const {getProvider} = useWeb3();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(onNotificationList());
  }, [dispatch]);

  const {notifications, selected} = useSelector<
    AppState,
    AppState['notification']
  >(({notification}) => notification);

  const classes = useStyles();

  const [showNotifications, setShowNotifications] = useState(false);

  const handleToggleNotifications = useCallback(() => {
    setShowNotifications((value) => !value);
  }, []);

  useEffect(() => {
    let transactionNotifications = notifications.filter((notification) => {
      let isTransaction = notification.type === NotificationType.TRANSACTION;
      let isPending =
        (notification.metadata as TxNotificationMetadata).status == 'pending';
      return isTransaction && isPending;
    });

    for (let notificaiton of transactionNotifications) {
      let metadata = notificaiton.metadata as TxNotificationMetadata;

      isTransactionMined(getProvider(), metadata.transactionHash).then(
        (result: ethers.providers.TransactionReceipt | null) => {
          console.log('aquui');
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
            notifications.filter((notification) => notification.check === null)
              .length
          }
          color='secondary'>
          <NotificationIcon />
        </Badge>
      </AppBarButton>
    </>
  );
};

export default Notifications;
