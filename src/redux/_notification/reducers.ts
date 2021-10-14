import {Notification} from 'types/models/Notification';


import {
  NotificationAction,
} from 'types/actions/Notification.actions';

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
      const newAddNotifications = [...state.notifications, ...newNotifications];

      return {
        ...state,
        //Filtering the null notifications, giving blank screen
        notifications: newAddNotifications.filter(n => n).map((n, index: number) => {
          if (!n.id) {
            return {...n, id: index};
          }
        }),
      };
    }
    case NotificationAction.NOTIFICATION_LIST: {
      return {...state};
    }
    case NotificationAction.GET_NOTIFICATION: {
      const id = action.payload;

      let getIndex = state.notifications.findIndex((n) => n?.id == id);

      return {
        notifications: state.notifications,
        selected: getIndex > -1 ? state.notifications[getIndex] : undefined,
      };
    }
    case NotificationAction.UPDATE_NOTIFICATION: {
      let updateNotification: any = action.payload;

   
      let updatedNotifications = [...state.notifications];

      let updateIndex = updatedNotifications.findIndex(
        (n) => n?.id == updateNotification?.id,
      );

      updatedNotifications[updateIndex] = updateNotification;

      return {
        notifications: updatedNotifications,
        selected: state.selected,
      };
    }
    case NotificationAction.REMOVE_NOTIFICATION: {
      const id = action.payload;

      let newNotifications = state.notifications;

      let removeIndex = newNotifications.findIndex((n) => n?.id === id);

      newNotifications.splice(removeIndex, 1);

      return {...state, notifications: newNotifications};
    }
    case NotificationAction.CHECK_NOTIFICATION: {
      const id = action.payload;

      let newCheckedNotifications = [...state.notifications];

      let checkIndex = state.notifications.findIndex((n) => n?.id === id);

      if (checkIndex > -1) {
        newCheckedNotifications[checkIndex].check = new Date();
      }

      return {...state, notifications: newCheckedNotifications};
    }
    case NotificationAction.UNCHECKED_NOTIFICATION: {
      const id = action.payload;

      let newUncheckNotifications = [...state.notifications];

      let uncheckIndex = state.notifications.findIndex((n) => n?.id === id);

      if (uncheckIndex > -1) {
        newUncheckNotifications[uncheckIndex].check = undefined;
      }

      return {...state, notifications: newUncheckNotifications};
    }
    case NotificationAction.CHECK_ALL_NOTIFICATION: {
      let checkAllnotifications = state.notifications.map((n) => ({
        ...n,
        check: new Date(),
      }));

      return {...state, notifications: checkAllnotifications};
    }
    default: {
      return state;
    }
  }
};
