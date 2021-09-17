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
} from '@material-ui/core';
import {CremaTheme} from 'types/AppContextPropsType';
import {Notification} from 'types/models/Notification';
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
      disabled
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
      <ListItemText
        primary={item.title}
        secondary={
          <>
            <Box mb={2}>
              <Typography variant='body1'>{item.body ?? ''}</Typography>
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
        <IconButton onClick={handleRemove}>
          <Delete />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default NotificationItem;
