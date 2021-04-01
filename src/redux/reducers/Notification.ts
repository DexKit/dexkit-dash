import { getNotificationList } from "services/notification";
import { NotificationActions } from "types/actions/Notification.actions";

const initialState = {
  notifications: getNotificationList()
}

export default (state = initialState, action: NotificationActions) => {
  // if (NotificationAction[action.type] != null) {
  //   return action.payload;
  // }
  return state;
}
