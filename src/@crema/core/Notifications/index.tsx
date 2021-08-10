import React, {useEffect} from 'react';
import clsx from 'clsx';
import {useDispatch, useSelector} from 'react-redux';
import {makeStyles, Popover} from '@material-ui/core';
import {Box, Button, Badge, List, Hidden} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import Scrollbar from '../Scrollbar';
import IntlMessages from '../../utility/IntlMessages';
import NotificationItem from './NotificationItem';
import {Fonts} from 'shared/constants/AppEnums';
import {CremaTheme} from 'types/AppContextPropsType';
import {
  onNotificationList,
  onCheckNotification,
  onCheckAllNotification,
} from 'redux/_notification/actions';
import {AppState} from 'redux/store';

import {ReactComponent as NotificationIcon} from 'assets/images/icons/notification.svg';
import AppBarButton from 'shared/components/AppBar/AppBarButton';
interface NotificationsProps {}

const Notifications: React.FC<NotificationsProps> = () => {
  const [
    anchorNotification,
    setAnchorNotification,
  ] = React.useState<HTMLButtonElement | null>(null);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(onNotificationList());
  }, [dispatch]);

  const onClickNotificationButton = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setAnchorNotification(event.currentTarget);
  };

  const {notifications, selected} = useSelector<
    AppState,
    AppState['notification']
  >(({notification}) => notification);

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

  const classes = useStyles();

  return (
    <>
      <AppBarButton onClick={onClickNotificationButton}>
        {true ? (
          <Badge
            badgeContent={
              notifications.filter((notification) => notification.check == null)
                .length
            }
            color='secondary'>
            <NotificationIcon />
          </Badge>
        ) : (
          <Box ml={4} fontSize={16} color='text.secondary' component='span'>
            <IntlMessages id='common.notifications' />
          </Box>
        )}
      </AppBarButton>

      <Popover
        anchorEl={anchorNotification}
        id='language-switcher'
        className={classes.crPopover}
        keepMounted
        open={Boolean(anchorNotification)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClose={() => setAnchorNotification(null)}>
        <Box>
          <Box px={5} py={3}>
            <Box component='h5' fontFamily={Fonts.LIGHT}>
              <IntlMessages id='common.notifications' />({notifications.length})
            </Box>
          </Box>
          <Scrollbar className='scroll-submenu'>
            <List
              className={classes.list}
              onClick={() => {
                setAnchorNotification(null);
              }}>
              {notifications.map((item, i) => (
                <NotificationItem
                  onClick={() => {
                    dispatch(onCheckNotification(Number(item.id)));
                  }}
                  id={Number(item?.id ?? i)}
                  listStyle={classes.notificationItem}
                  key={item?.id?.toString() ?? i}
                  item={item}
                />
              ))}
            </List>
          </Scrollbar>
        </Box>
      </Popover>
    </>
  );
};

export default Notifications;
