import React, {memo, useCallback, useMemo} from 'react';
import {CircularProgress} from '@material-ui/core';

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
import {useDispatch, useSelector} from 'react-redux';
import {onRemoveNotification} from 'redux/actions';
import Delete from '@material-ui/icons/Delete';
import {NotificationType, TxNotificationMetadata} from 'types/notifications';

import {AppState} from 'redux/store';
import {TransactionStatus} from 'redux/_transactions/types';

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

  const {transactions} = useSelector<AppState, AppState['transactions']>(
    ({transactions}) => transactions,
  );

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(item);
    }
  }, [item, onClick]);

  const handleRemove = useCallback(() => {
    dispatch(onRemoveNotification(id));
  }, [dispatch, id]);

  const isTransaction = item?.type === NotificationType.TRANSACTION;

  const transaction = useMemo(() => {
    if (transactions !== undefined && isTransaction) {
      const metadata: TxNotificationMetadata =
        item.metadata as TxNotificationMetadata;

      const txIndex = transactions.findIndex(
        (tx) => tx.hash === metadata.transactionHash,
      );

      return transactions[txIndex];
    }

    return undefined; // eslint-disable-next-line
  }, [String(transactions), item, isTransaction]);

  const isTransactionPending =
    transaction?.status === TransactionStatus.Pending;

  const isTransactionDone = transaction?.status === TransactionStatus.Confirmed;
  const isTransactionFailed = transaction?.status === TransactionStatus.Failed;

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
        primary={<Typography variant='body1'>{item?.title || ''}</Typography>}
        secondary={
          <>
            <Box mb={2}>
              <Typography variant='body2'>{item?.body || ''}</Typography>
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

export default memo(NotificationItem);
