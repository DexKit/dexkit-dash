import { Notification } from 'types/models/Notification';

import { NotificationType, NotificationPosition } from 'services/notification';

export enum NotificationAction {
  GET_NOTIFICATION = 'GET_NOTIFICATION',
  ADD_NOTIFICATION = 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION',
  REMOVE_ALL_NOTIFICATIONS = 'REMOVE_ALL_NOTIFICATIONS',
  CHECK_NOTIFICATION = 'CHECK_NOTIFICATION',
  UNCHECKED_NOTIFICATION = 'UNCHECKED_NOTIFICATION',
  CHECK_ALL_NOTIFICATION = 'CHECK_ALL_NOTIFICATION',
  NOTIFICATION_LIST = 'NOTIFICATION_LIST',
  UPDATE_NOTIFICATION = 'UPDATE_NOTIFICATION',
  SEEN_NOTIFICATION = 'SEEN_NOTIFICATION',

}

export interface GetNotification {
  type: typeof NotificationAction.GET_NOTIFICATION;
  payload: number;
}

export interface AddNotification {
  type: typeof NotificationAction.ADD_NOTIFICATION;
  payload: {
    notifications: Notification[];
    type: NotificationType;
    position: NotificationPosition;
  };
}

export interface RemoveNotification {
  type: typeof NotificationAction.REMOVE_NOTIFICATION;
  payload: number;
}

export interface CheckNotification {
  type: typeof NotificationAction.CHECK_NOTIFICATION;
  payload: number;
}

export interface UncheckedNotification {
  type: typeof NotificationAction.UNCHECKED_NOTIFICATION;
  payload: number;
}

export interface CheckAllNotification {
  type: typeof NotificationAction.CHECK_ALL_NOTIFICATION;
}

export interface NotificationList {
  type: typeof NotificationAction.NOTIFICATION_LIST;
}

export interface UpdateNotification {
  type: typeof NotificationAction.UPDATE_NOTIFICATION;
  payload: Notification;
}

export type NotificationActions =
  | GetNotification
  | AddNotification
  | RemoveNotification
  | CheckNotification
  | UncheckedNotification
  | CheckAllNotification
  | NotificationList
  | UpdateNotification;
