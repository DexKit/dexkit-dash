import {Dispatch} from 'react';
import {AppActions} from 'types';
import {Notification} from 'types/models/Notification';
import {NotificationAction} from 'types/actions/Notification.actions';

export const onAddNotification = (notifications: Notification[]) => {
  return (dispatch: Dispatch<AppActions>) => {
    dispatch({
      type: NotificationAction.ADD_NOTIFICATION,
      payload: {notifications},
    });
  };
};

export const onRemoveNotification = (id: string | number | symbol) => {
  return (dispatch: Dispatch<AppActions>) => {
    dispatch({type: NotificationAction.REMOVE_NOTIFICATION, payload: id});
  };
};

export const updateNotification = (
  index: number,
  notification: Notification,
) => {
  return {
    type: NotificationAction.UPDATE_NOTIFICATION,
    payload: {notification, index},
  };
};
