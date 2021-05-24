export interface Message {
  /**
   * The id of a message
   */
  id?: string | number
  /**
   * The title of a message.
   */
  title?: string;

  /**
   * The body of a message.
   */
  body: string;

  /**
   * The URL of the image or local image that is shown with the message. 
   */
  image?: string;

}