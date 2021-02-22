import { FeedImage } from "./feedImage.interface";
import { FeedItem } from "./feedItem.interface";

export interface Feed {
	items: FeedItem[];
	feedUrl: string | URL;
	image: FeedImage;
	paginationLinks: any;
	title: string;
	description: string;
	generator: string;
	link: string | URL;
	language: string;
	lastBuildDate: string;
}