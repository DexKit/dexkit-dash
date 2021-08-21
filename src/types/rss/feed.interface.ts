import {FeedImage} from './feedImage.interface';
import {FeedItem} from './feedItem.interface';

export interface Feed {
  items: FeedItem[];
  feedUrl: string;
  image: FeedImage;
  paginationLinks: any;
  title: string;
  description: string;
  generator: string;
  link: string;
  language: string;
  lastBuildDate: string;
}
