import React, {useRef, useState, useCallback} from 'react';
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
import {useDispatch} from 'react-redux';
import {onRemoveNotification, onUncheckedNotification} from 'redux/actions';
import Delete from '@material-ui/icons/Delete';
import {NotificationType, TxNotificationMetadata} from 'types/notifications';

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

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(item);
    }
  }, [item, onClick]);

  const handleRemove = useCallback(() => {
    dispatch(onRemoveNotification(item?.id ?? id));
  }, [item]);

  const isTransaction = item?.type === NotificationType.TRANSACTION;

  const isTransactionPending =
    (item?.metadata as TxNotificationMetadata)?.status === 'pending';
  const isTransactionDone =
    (item?.metadata as TxNotificationMetadata)?.status === 'done';
  const isTransactionFailed =
    (item?.metadata as TxNotificationMetadata)?.status === 'failed';

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
            {item.image ? (
              <Avatar className={classes.avatar} src={item.image} />
            ) : (
              <Avatar className={classes.avatar} />
            )}
          </>
        )}
      </ListItemAvatar>
      <ListItemText
        primary={<Typography variant='body1'>{item.title ?? ''}</Typography>}
        secondary={
          <>
            <Box mb={2}>
              <Typography variant='body2'>{item.body ?? ''}</Typography>
            </Box>
            {item.url && item.urlCaption ? (
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
