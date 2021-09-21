import {Notification} from 'types/models/Notification';
import {
  addNotification,
  checkNotification,
  uncheckedNotification,
  getNotification,
  getNotificationList,
  removeNotification,
  checkAllNotification,
} from 'services/notification';

import {
  NotificationAction,
  NotificationActions,
} from 'types/actions/Notification.actions';

export interface NotificationState {
  readonly notifications: Notification[];
  readonly selected?: Notification;
}
const initialState: NotificationState = {
  notifications: getNotificationList(),
};

export default (
  state = initialState,
  action: NotificationActions,
): NotificationState => {
  switch (action.type) {
    case NotificationAction.ADD_NOTIFICATION: {
      const {notifications, type, position} = action.payload;
      let _notifications: Notification[] = [];
      notifications.forEach((notification) => {
        _notifications = addNotification(notification, type, position);
      });
      return {
        notifications: _notifications,
        selected: state.selected,
      };
    }
    // eslint-disable-next-line no-lone-blocks
    case NotificationAction.NOTIFICATION_LIST: {
      return {
        notifications: getNotificationList(),
        selected: state.selected,
      };
    }
    case NotificationAction.GET_NOTIFICATION: {
      const id = action.payload;
      return {
        notifications: state.notifications,
        selected: getNotification(id),
      };
    }
    case NotificationAction.UPDATE_NOTIFICATION: {
      let newNotification: Notification = action.payload;
      let newNotifications = [...state.notifications];

      let updateIndex = newNotifications.findIndex(
        (n) => n.id == newNotification.id,
      );

      newNotifications[updateIndex] = newNotification;

      return {
        notifications: newNotifications,
        selected: state.selected,
      };
    }
    case NotificationAction.REMOVE_NOTIFICATION: {
      const id = action.payload;
      const notification = removeNotification(id);
      if (notification != null) {
        let selected: Notification | undefined = state?.selected;
        if (selected != null) {
          selected =
            selected?.id?.toString() === notification?.id?.toString()
              ? undefined
              : selected;
        }
        return {
          notifications: getNotificationList(),
          selected: selected,
        };
      }
      return state;
    }
    case NotificationAction.CHECK_NOTIFICATION: {
      const id = action.payload;
      const notification = checkNotification(id);
      if (notification != null) {
        let selected: Notification | undefined = state?.selected;
        if (selected != null) {
          selected =
            selected?.id?.toString() === notification?.id?.toString()
              ? notification
              : selected;
        }
        return {
          notifications: getNotificationList(),
          selected: selected,
        };
      }
      return state;
    }
    case NotificationAction.UNCHECKED_NOTIFICATION: {
      const id = action.payload;
      const notification = uncheckedNotification(id);
      if (notification != null) {
        let selected: Notification | undefined = state?.selected;
        if (selected != null) {
          selected =
            selected?.id?.toString() === notification?.id?.toString()
              ? notification
              : selected;
        }
        return {
          notifications: getNotificationList(),
          selected: selected,
        };
      }
      return state;
    }
    case NotificationAction.CHECK_ALL_NOTIFICATION: {
      const notifications = checkAllNotification();
      let selected: Notification | undefined = state?.selected;
      if (selected != null) {
        selected = notifications.find(
          (x) => x.id?.toString() === selected?.id?.toString(),
        );
      }
      return {
        notifications,
        selected,
      };
    }
    default: {
      return state;
    }
  }
};
