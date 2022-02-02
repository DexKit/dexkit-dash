import React, {useCallback, useEffect, useState} from 'react';
import {CircularProgress} from '@material-ui/core';

import {ethers} from 'ethers';

// import PropTypes from 'prop-types';
import {
  ListItemAvatar,
  Avatar,
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Box,
  Typography,
  Button,
  useTheme,
} from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import {CremaTheme} from 'types/AppContextPropsType';
import {Notification} from 'types/models/Notification';
import {useDispatch} from 'react-redux';
import {onRemoveNotification, updateNotification} from 'redux/actions';
import Delete from '@material-ui/icons/Delete';
import {NotificationType, TxNotificationMetadata} from 'types/notifications';
import IntlMessages from '@crema/utility/IntlMessages';
import {useChainInfo} from 'hooks/useChainInfo';
import {isTransactionMined} from 'utils/blockchain';
import {useWeb3} from 'hooks/useWeb3';
import {useSnackbar} from 'notistack';
import {useIntl} from 'react-intl';

const useStyles = makeStyles((theme: CremaTheme) => ({
  avatar: {
    width: 24,
    height: 24,
  },
}));

interface NotificationItemProps {
  item: Notification;
  onClick?: (item: Notification) => void;
  id: number;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  item,
  onClick,
  id,
}) => {
  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();
  const {getProvider} = useWeb3();
  const {getScannerUrl} = useChainInfo();

  const {messages} = useIntl();

  const {enqueueSnackbar} = useSnackbar();

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(item);
    }
  }, [item, onClick]);

  const handleRemove = useCallback(() => {
    dispatch(onRemoveNotification(item?.id ?? id));
  }, [dispatch, item, id]);

  const isTransaction = item?.type === NotificationType.TRANSACTION;

  const isTransactionPending =
    (item?.metadata as TxNotificationMetadata)?.status === 'pending';
  const isTransactionDone =
    (item?.metadata as TxNotificationMetadata)?.status === 'done';
  const isTransactionFailed =
    (item?.metadata as TxNotificationMetadata)?.status === 'failed';

  const handleViewTransaction = useCallback(
    (chainId: number, hash: string) => {
      window.open(`${getScannerUrl(chainId)}/tx/${hash}`, '_blank');
    },
    [getScannerUrl],
  );

  const [waitingConfirm, setWaitingConfirm] = useState(false);

  useEffect(() => {
    const metadata = item.metadata as TxNotificationMetadata;

    const isTransaction = item?.type === NotificationType.TRANSACTION;
    const isPending =
      (item?.metadata as TxNotificationMetadata)?.status === 'pending';

    if (!waitingConfirm) {
      setWaitingConfirm(true);

      if (isTransaction && isPending) {
        isTransactionMined(getProvider(), metadata.transactionHash).then(
          (result: ethers.providers.TransactionReceipt | undefined) => {
            if (result !== undefined) {
              if ((result.status || 0) === 1) {
                if (window.Notification.permission === 'denied') {
                  enqueueSnackbar(
                    messages['app.common.transactionConfirmed'] as string,
                    {
                      variant: 'success',
                      autoHideDuration: 5000,
                      action: (
                        <Button
                          onClick={() =>
                            handleViewTransaction(
                              metadata.chainId,
                              metadata.transactionHash,
                            )
                          }>
                          <IntlMessages id='app.common.view' />
                        </Button>
                      ),
                    },
                  );
                } else {
                  window.Notification.requestPermission().then((value) => {
                    if (typeof window !== 'undefined') {
                      const notification = new window.Notification(
                        messages['app.common.transactionConfirmed'] as string,
                      );

                      notification.onclick = () =>
                        handleViewTransaction(
                          metadata.chainId,
                          metadata.transactionHash,
                        );
                    }
                  });
                }

                dispatch(
                  updateNotification({
                    ...item,
                    metadata: {
                      ...metadata,
                      status: 'done',
                    } as TxNotificationMetadata,
                  }),
                );
                setWaitingConfirm(false);
              } else if ((result.status || 0) === 0) {
                if (window.Notification.permission === 'denied') {
                  enqueueSnackbar(
                    messages['app.common.transactionFailed'] as string,
                    {
                      variant: 'error',
                      autoHideDuration: 5000,
                      action: (
                        <Button
                          onClick={() =>
                            handleViewTransaction(
                              metadata.chainId,
                              metadata.transactionHash,
                            )
                          }>
                          <IntlMessages id='app.common.view' />
                        </Button>
                      ),
                    },
                  );
                } else {
                  window.Notification.requestPermission().then((value) => {
                    if (typeof window !== 'undefined') {
                      const notification = new window.Notification(
                        messages['app.common.transactionFailed'] as string,
                      );

                      notification.onclick = () =>
                        handleViewTransaction(
                          metadata.chainId,
                          metadata.transactionHash,
                        );
                    }
                  });
                }

                dispatch(
                  updateNotification({
                    ...item,
                    metadata: {
                      ...metadata,
                      status: 'failed',
                    } as TxNotificationMetadata,
                  }),
                );
                setWaitingConfirm(false);
              }
            }
          },
        );
      }
    }
  }, [
    waitingConfirm,
    item,
    dispatch,
    enqueueSnackbar,
    getProvider,
    handleViewTransaction,
    messages,
  ]);

  return (
    <ListItem id={item?.id?.toString() ?? id.toString()} onClick={handleClick}>
      <ListItemAvatar>
        {isTransaction ? (
          <>
            {isTransactionPending ? (
              <CircularProgress />
            ) : isTransactionDone ? (
              <CheckCircleOutlineIcon
                style={{
                  color: theme.palette.success.main,
                  fontSize: theme.spacing(10),
                }}
                fontSize='inherit'
              />
            ) : isTransactionFailed ? (
              <HighlightOffIcon
                style={{
                  color: theme.palette.error.main,
                  fontSize: theme.spacing(10),
                }}
                fontSize='inherit'
              />
            ) : null}
          </>
        ) : (
          <>
            {item?.image ? (
              <Avatar className={classes.avatar} src={item.image} />
            ) : (
              <Avatar className={classes.avatar} />
            )}
          </>
        )}
      </ListItemAvatar>
      <ListItemText
        primary={<Typography variant='body1'>{item?.title ?? ''}</Typography>}
        secondary={
          <>
            <Box mb={2}>
              <Typography variant='body2'>{item?.body ?? ''}</Typography>
            </Box>
            {item?.url && item?.urlCaption ? (
              <Box>
                <Button
                  size='small'
                  color='primary'
                  target='_blank'
                  href={item.url}>
                  {item.urlCaption}
                </Button>
              </Box>
            ) : null}
          </>
        }
      />
      <ListItemSecondaryAction>
        <IconButton size='small' onClick={handleRemove}>
          <Delete />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default NotificationItem;
