import {store} from 'react-notifications-component';
import {Notification} from 'types/models/Notification';
import {getRandomIntInclusive} from 'utils/number';
//import { messaging } from '@crema/services/auth/firebase/firebase';

const STORAGE_KEY = '@__dexkit_app_notifications';

export enum NotificationType {
  ERROR = 'danger',
  SUCCESS = 'success',
  WARNING = 'warning',
  INFO = 'info',
}

export enum NotificationPosition {
  TOP_LEFT = 'top-left',
  TOP_RIGHT = 'top-right',
  TOP_CENTER = 'top-center',
  CENTER = 'center',
  BOTTOM_LEFT = 'bottom-left',
  BOTTOM_RIGHT = 'bottom-right',
  BOTTOM_CENTER = 'bottom-center',
}

function persist(notifications: Notification[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
}
function checkAction(
  id: string | number | symbol,
  dt?: Date,
): Notification | undefined {
  const notifications: Notification[] = getNotificationList();
  const index = notifications.findIndex(
    (n) => n.id?.toString() === id.toString(),
  );
  if (index >= 0) {
    notifications[index].check = dt;
    persist(notifications);
    return notifications[index];
  }
  return undefined;
}

export function idGenerator(): number {
  return getRandomIntInclusive(1, Number.MAX_SAFE_INTEGER);
}

export function addNotification(
  notification: Notification,
  type = NotificationType.INFO,
  position = NotificationPosition.BOTTOM_RIGHT,
): Notification[] {
  const notifications: Notification[] = getNotificationList();
  console.log('notification', notification);
  console.log('notifications', notifications);

  notification.id = notification.id != null ? notification.id : idGenerator();
  notifications.push(notification);
  persist(notifications);
  store.addNotification({
    title: notification.title,
    message: notification.body,
    type,
    insert: 'top',
    container: position,
    // animationIn: ["animate__animated", "animate__fadeIn"],
    // animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 10000,
      onScreen: false,
    },
  });
  return notifications;
}

export function onNotification(callbackEvent: (args: any) => void) {
  //messaging.onMessage(payload => {
  // const notification: Notification = Object.assign({} as Notification, payload);
  // callbackEvent(payload);
  //});
}

export function getNotificationList(): Notification[] {
  const notifications: Notification[] = JSON.parse(
    localStorage.getItem(STORAGE_KEY) ?? '[]',
  ) as Notification[];
  return notifications;
}

export function removeNotification(
  id: string | number | symbol,
): Notification | undefined {
  const notifications: Notification[] = getNotificationList();
  const index = notifications.findIndex(
    (x) => x.id?.toString() === id.toString(),
  );
  const not = index >= 0 ? notifications.splice(index, 1)[0] : undefined;
  persist(notifications);
  return not;
}

export function checkNotification(
  id: string | number | symbol,
): Notification | undefined {
  return checkAction(id, new Date());
}

export function uncheckedNotification(
  id: string | number | symbol,
): Notification | undefined {
  return checkAction(id);
}

export function checkAllNotification() {
  const dt = new Date();
  const notifications: Notification[] = getNotificationList().map((x) => {
    x.check = dt;
    return x;
  });
  persist(notifications);
  return notifications;
}
