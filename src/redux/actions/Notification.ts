import { Dispatch } from "react";
import { AppActions } from "types";
import { fetchError, fetchStart, fetchSuccess } from ".";
import {
  addNotification,
  checkNotification,
  getNotification,
  getNotificationList,
  NotificationType,
  NotificationPosition,
  removeNotification
} from 'services/notification';

import {  NotificationAction } from 'types/actions/Notification.actions';

export const onNotificationList = () => {
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(fetchStart());
    try {
      const notifications = getNotificationList();
      dispatch(fetchSuccess());
      dispatch({ type: NotificationAction.NOTIFICATION_LIST, payload: notifications});
    } catch (error) {
      dispatch(fetchError(error.message));
    }
  };
};

export const onAddNotification = (
  notification: Notification,
  type = NotificationType.INFO,
  position = NotificationPosition.BOTTOM_RIGHT
) => {
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(fetchStart());
    try {
      const notifications = addNotification(notification, type, position);
      dispatch(fetchSuccess());
      dispatch({ type: NotificationAction.ADD_NOTIFICATION, payload: notifications});
    } catch (error) {
      dispatch(fetchError(error.message));
    }
  };
};

export const onGetNotification = (id: string | number | Symbol) => {
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(fetchStart());
    try {
      const notification = getNotification(id);
      dispatch(fetchSuccess());
      dispatch({ type: NotificationAction.GET_NOTIFICATION, payload: notification});
    } catch (error) {
      dispatch(fetchError(error.message));
    }
  };
}

export const onRemoveNotification = (id: string | number | Symbol) => {
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(fetchStart());
    try {
      const notification = removeNotification(id);
      dispatch(fetchSuccess());
      dispatch({ type: NotificationAction.REMOVE_NOTIFICATION, payload:  notification});
    } catch (error) {
      dispatch(fetchError(error.message));
    }
  };
}

export const onCheckNotification = (notification: Notification) => {
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(fetchStart());
    try {
      const _notification = checkNotification(notification);
      dispatch(fetchSuccess());
      dispatch({ type: NotificationAction.CHECK_NOTIFICATION, payload: _notification});
    } catch (error) {
      dispatch(fetchError(error.message));
    }
  };
}