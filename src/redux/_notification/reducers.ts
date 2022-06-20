import { Notification } from 'types/models/Notification';

import { NotificationAction } from 'types/actions/Notification.actions';

export interface NotificationState {
  readonly notifications: Notification[];
  readonly hasSeenNotification: boolean;
  readonly notificationsNotSeen: number;
  readonly selected?: Notification;
}
const initialState: NotificationState = {
  notifications: [],
  hasSeenNotification: true,
  notificationsNotSeen: 0,
};

export default (state = initialState, action: any): NotificationState => {
  switch (action.type) {
    case NotificationAction.ADD_NOTIFICATION: {
      const { notifications: newNotifications } = action.payload;
      const newAddNotifications = [...newNotifications, ...state.notifications];
      return {
        ...state,
        //Filtering the null notifications, giving blank screen
        notifications: newAddNotifications,
        hasSeenNotification: false,
        notificationsNotSeen: state.notificationsNotSeen + 1,
      };
    }
    case NotificationAction.UPDATE_NOTIFICATION: {
      let { notification, index }: any = action.payload;

      let updatedNotifications = [...state.notifications];

      updatedNotifications[index] = notification;

      return {
        notifications: updatedNotifications,
        selected: state.selected,
        hasSeenNotification: state.hasSeenNotification,
        notificationsNotSeen: state.notificationsNotSeen,
      };
    }
    case NotificationAction.REMOVE_NOTIFICATION: {
      const id = action.payload;

      let newNotifications = state.notifications;

      newNotifications.splice(id, 1);

      return { ...state, notifications: newNotifications };
    }

    case NotificationAction.REMOVE_ALL_NOTIFICATIONS: {
      return { ...state, notifications: [] };
    }
    case NotificationAction.SEEN_NOTIFICATION: {
      return { ...state, hasSeenNotification: true, notificationsNotSeen: 0 };
    }
    default:
      return { ...state };
  }
};
