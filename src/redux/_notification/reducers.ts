import {Notification} from 'types/models/Notification';

import {NotificationAction} from 'types/actions/Notification.actions';

export interface NotificationState {
  readonly notifications: Notification[];
  readonly selected?: Notification;
}
const initialState: NotificationState = {
  notifications: [],
};

export default (state = initialState, action: any): NotificationState => {
  switch (action.type) {
    case NotificationAction.ADD_NOTIFICATION: {
      const {notifications: newNotifications} = action.payload;
      const newAddNotifications = [...newNotifications, ...state.notifications];

      return {
        ...state,
        //Filtering the null notifications, giving blank screen
        notifications: newAddNotifications,
      };
    }
    case NotificationAction.UPDATE_NOTIFICATION: {
      let {notification, index}: any = action.payload;

      let updatedNotifications = [...state.notifications];

      updatedNotifications[index] = notification;

      return {
        notifications: updatedNotifications,
        selected: state.selected,
      };
    }
    case NotificationAction.REMOVE_NOTIFICATION: {
      const id = action.payload;

      let newNotifications = state.notifications;

      newNotifications.splice(id, 1);

      return {...state, notifications: newNotifications};
    }
    default:
      return {...state};
  }
};
