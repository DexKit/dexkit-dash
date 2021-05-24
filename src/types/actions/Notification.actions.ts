import { Notification } from 'types/models/Notification';

export enum NotificationAction {
  GET_NOTIFICATION = 'GET_NOTIFICATION',
  ADD_NOTIFICATION = 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION',
  CHECK_NOTIFICATION = 'CHECK_NOTIFICATION',
  NOTIFICATION_LIST = 'NOTIFICATION_LIST'
}

export interface GetNotification {
  type: typeof NotificationAction.GET_NOTIFICATION;
  payload: Notification | undefined;
}

export interface AddNotification {
  type: typeof NotificationAction.ADD_NOTIFICATION;
  payload: Notification[];
}

export interface RemoveNotification {
  type: typeof NotificationAction.REMOVE_NOTIFICATION;
  payload: Notification | undefined;
}

export interface CheckNotification {
  type: typeof NotificationAction.CHECK_NOTIFICATION;
  payload: Notification | undefined;
}

export interface NotificationList {
  type: typeof NotificationAction.NOTIFICATION_LIST;
  payload: Notification[];
}
export type NotificationActions = GetNotification | AddNotification | RemoveNotification | CheckNotification | NotificationList;
