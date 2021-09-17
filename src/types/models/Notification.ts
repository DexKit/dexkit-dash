export interface Notification {
  /**
   * The id of a notification
   */
  id?: string | number | symbol;
  /**
   * The title of a notification.
   */
  title?: string;

  /**
   * The body of a notification.
   */
  body: string;

  /**
   * The URL of the image that is shown with the notification. See
   * `notification.image`} for supported image format.
   */
  image?: string;

  /**
   * The timestamp of a notification
   */
  timestamp?: number;

  /**k,
   * The Date of visualization
   */
  check?: Date;

  /**
   * loading
   */
  loading?: boolean;

  /**
   * url
   */
  url?: string;

  /**
   *
   */
  urlCaption?: string;

  /**
   * Notification metadata;
   */
  metadata?: any;
}
