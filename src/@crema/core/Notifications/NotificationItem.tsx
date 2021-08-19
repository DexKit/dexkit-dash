import React, {useEffect, useRef, useState} from 'react';
import {} from '@material-ui/core';
// import PropTypes from 'prop-types';
import {
  Box,
  ListItemAvatar,
  Avatar,
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Badge,
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

interface NotificationItemProps {
  item: Notification;
  listStyle: string;
  onClick?: React.MouseEventHandler<HTMLLIElement> | undefined;
  id: number;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  item,
  onClick,
  listStyle,
  id,
}) => {
  const useStyles = makeStyles((theme: CremaTheme) => ({
    textBase: {
      fontSize: 16,
      [theme.breakpoints.up('xl')]: {
        fontSize: 18,
      },
    },
    avatar: {
      width: 40,
      height: 40,
      [theme.breakpoints.up('xl')]: {
        width: 60,
        height: 60,
      },
    },
    minWidth0: {
      minWidth: 0,
    },
    badge: {
      marginRight: 8,
    },
  }));

  const classes = useStyles();
  const dispatch = useDispatch();
  const [showOptions, setShowOptions] = useState(false);
  const ref = useRef<Element>();

  const options = (item: Notification): NotificationItemOptionsData[] => {
    if (item?.check) {
      return [
        {
          option: 'Delete',
          action: () => dispatch(onRemoveNotification(item?.id ?? id)),
        },
        {
          option: 'View later',
          action: () => dispatch(onUncheckedNotification(item?.id ?? id)),
        },
      ];
    }
    return [
      {
        option: 'Delete',
        action: () => dispatch(onRemoveNotification(item?.id ?? id)),
      },
    ];
  };

  useEffect(() => console.log('show notification options', showOptions), [
    showOptions,
  ]);

  return (
    <>
      <ListItem
        id={item?.id?.toString() ?? id.toString()}
        onClick={onClick}
        className={listStyle}>
        <Box mr={4}>
          <ListItemAvatar className={classes.minWidth0}>
            <Avatar
              className={classes.avatar}
              alt='Remy Sharp'
              src={item.image}
            />
          </ListItemAvatar>
        </Box>
        {/* <Box component='p' className={classes.textBase} color='grey.500'>
        <Box
          mr={2}
          component='span'
          display='inline-block'
          color='text.primary'
          fontFamily={Fonts.LIGHT}>
          {item.title}
        </Box>
        {item.body ?? ''}
      </Box> */}
        <ListItemText
          className={classes.textBase}
          style={{
            fontFamily: Fonts.LIGHT,
            color: 'text.primary',
            marginInline: '2rem',
          }}
          primary={item.title}
          secondary={item.body ?? ''}
        />
        <ListItemSecondaryAction>
          <IconButton
            edge='end'
            aria-label='options'
            onClick={($e) => {
              ref.current = $e.currentTarget;
              $e.preventDefault();
              $e.stopPropagation();
              setShowOptions(true);
            }}>
            {item?.check ? (
              <MoreVertOutlined />
            ) : (
              <Badge className={classes.badge} variant='dot' color='secondary'>
                <MoreVertOutlined />
              </Badge>
            )}
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      {showOptions && (
        <NotificationItemOptions
          options={options(item)}
          anchorEl={ref.current}
          open={showOptions}
          onClose={($e) => {
            setShowOptions(false);
            ref.current = undefined;
          }}
        />
      )}
    </>
  );
};

export default NotificationItem;

// NotificationItem.propTypes = {
//   item: PropTypes.object.isRequired,
// };
