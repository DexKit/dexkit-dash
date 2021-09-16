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
} from '@material-ui/core';
import {Fonts} from 'shared/constants/AppEnums';
import {CremaTheme} from 'types/AppContextPropsType';
import {Notification} from 'types/models/Notification';
import {FilterTiltShiftSharp, MoreVertOutlined} from '@material-ui/icons';
import {
  NotificationItemOptions,
  NotificationItemOptionsData,
} from './NotificationItemOptions';
import {useDispatch} from 'react-redux';
import {onRemoveNotification, onUncheckedNotification} from 'redux/actions';
import Delete from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme: CremaTheme) => ({
  avatar: {
    width: 40,
    height: 40,
    [theme.breakpoints.up('xl')]: {
      width: 60,
      height: 60,
    },
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

  return (
    <ListItem
      button
      id={item?.id?.toString() ?? id.toString()}
      onClick={handleClick}>
      <ListItemAvatar>
        {item.loading ? (
          <CircularProgress />
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
      <ListItemText primary={item.title} secondary={item.body ?? ''} />
      <ListItemSecondaryAction>
        <IconButton onClick={handleRemove}>
          <Delete />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default NotificationItem;
