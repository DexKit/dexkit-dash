import { store } from 'react-notifications-component';
import { Notification } from 'types/models/Notification';
//import { messaging } from '@crema/services/auth/firebase/firebase';

export enum NotificationType {
  ERROR = 'danger',
  SUCCESS = 'success',
  WARNING = 'warning',
  INFO = 'info'
}

export enum NotificationPosition {
  TOP_LEFT = 'top-left',
  TOP_RIGHT = 'top-right',
  TOP_CENTER = 'top-center',
  CENTER = 'center',
  BOTTOM_LEFT = 'bottom-left',
  BOTTOM_RIGHT = 'bottom-right',
  BOTTOM_CENTER = 'bottom-center'
}

export function addNotification(
  notification: Notification,
  type = NotificationType.INFO,
  position = NotificationPosition.BOTTOM_RIGHT
): Notification[] {
  const notifications: Notification[] = JSON.parse(localStorage.getItem('notifications') ?? '[]') as Notification[];
  notifications.push(notification);
  localStorage.setItem('notifications', JSON.stringify(notifications));
  store.addNotification({
    title: notification.title,
    message: notification.body,
    type,
    insert: "top",
    container: position,
    // animationIn: ["animate__animated", "animate__fadeIn"],
    // animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 5000,
      onScreen: true
    }
  });
  return notifications;
}

export function onNotification(callbackEvent: (args: any) => void){
  //messaging.onMessage(payload => {
    // const notification: Notification = Object.assign({} as Notification, payload);
   // callbackEvent(payload);
  //});
}

export function getNotification(id: string | number | Symbol): Notification | undefined{
  const notifications: Notification[] = getNotificationList();
  const index = notifications.findIndex( n => n.id === id);
  const not = index >= 0 ? notifications[index] :  undefined;
  return not;
}

export function getNotificationList(): Notification[]{
  const notifications: Notification[] = JSON.parse(localStorage.getItem('notifications') ?? '[]') as Notification[];
  return notifications;
}

export function removeNotification(id: string | number | Symbol): Notification | undefined {
  const notifications: Notification[] = getNotificationList();
  const index = notifications.findIndex( n => n.id === id);
  const not = index >= 0 ? notifications.splice(index,1)[0] :  undefined;
  return not;
}

export function checkNotification(notification: Notification): Notification | undefined{
  const notifications: Notification[] = getNotificationList();
  const index = notifications.findIndex( n => n.id === notification.id);
  let dt;
  if(index >= 0){
    dt = new Date();
    notification.check = dt;
    notifications[index] = notification;
    localStorage.setItem('notifications', JSON.stringify(notifications));
    return notification;
  }
  return undefined;
}