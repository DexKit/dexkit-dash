import {Dispatch} from 'react';
import {AppActions} from 'types';
import {fetchError, fetchStart, fetchSuccess} from '../_common/actions';
import {Notification} from 'types/models/Notification';
import {NotificationAction} from 'types/actions/Notification.actions';
import {NotificationType, NotificationPosition} from 'services/notification';

export const onNotificationList = () => {
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(fetchStart());
    try {
      dispatch(fetchSuccess());
      dispatch({
        type: NotificationAction.NOTIFICATION_LIST,
        payload: undefined,
      });
    } catch (error) {
      dispatch(fetchError(error.message));
    }
  };
};

export const onAddNotification = (
  notifications: Notification[],
  type = NotificationType.INFO,
  position = NotificationPosition.BOTTOM_RIGHT,
) => {
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(fetchStart());
    const payload = {notifications, type, position};
    try {
      dispatch(fetchSuccess());
      dispatch({type: NotificationAction.ADD_NOTIFICATION, payload});
    } catch (error) {
      dispatch(fetchError(error.message));
    }
  };
};

export const onGetNotification = (id: string | number | symbol) => {
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(fetchStart());
    try {
      dispatch(fetchSuccess());
      dispatch({type: NotificationAction.GET_NOTIFICATION, payload: id});
    } catch (error) {
      dispatch(fetchError(error.message));
    }
  };
};

export const onRemoveNotification = (id: string | number | symbol) => {
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(fetchStart());
    try {
      dispatch(fetchSuccess());
      dispatch({type: NotificationAction.REMOVE_NOTIFICATION, payload: id});
    } catch (error) {
      dispatch(fetchError(error.message));
    }
  };
};

export const onCheckNotification = (id: string | number | symbol) => {
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(fetchStart());
    try {
      dispatch(fetchSuccess());
      dispatch({type: NotificationAction.CHECK_NOTIFICATION, payload: id});
    } catch (error) {
      dispatch(fetchError(error.message));
    }
  };
};

export const onUncheckedNotification = (id: string | number | symbol) => {
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(fetchStart());
    try {
      dispatch(fetchSuccess());
      dispatch({type: NotificationAction.UNCHECKED_NOTIFICATION, payload: id});
    } catch (error) {
      dispatch(fetchError(error.message));
    }
  };
};

export const onCheckAllNotification = () => {
  return (dispatch: Dispatch<AppActions>) => {
    dispatch(fetchStart());
    try {
      dispatch(fetchSuccess());
      dispatch({type: NotificationAction.CHECK_ALL_NOTIFICATION});
    } catch (error) {
      dispatch(fetchError(error.message));
    }
  };
};
