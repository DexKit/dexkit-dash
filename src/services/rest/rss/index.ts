import Parser from 'rss-parser';
import { Feed } from "types/rss/feed.interface";
import { FeedItem } from "types/rss/feedItem.interface";

export async function GetFeed(): Promise<Feed>{

	const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

  const url = new URL(`${CORS_PROXY}https://cointelegraph.com.br/rss`);

	const parser = new Parser<Feed, FeedItem>({
		// customFields: {
		//   item: [
		//     ['media:content', 'media:content', {keepArray: true}],
		//   ]
		// },
		headers: {
			"User-Agent": "Mozilla/5.0 (Windows NT x.y; Win64; x64; rv:10.0) Gecko/20100101 Firefox/10.0",
		},
		requestOptions: {
			rejectUnauthorized: false,
	  }
	});
	
	try {
		const response = await parser.parseURL(url.toString());
		const feed: Feed = response;
		return Promise.resolve(feed);
	} catch (e) {
		console.log(e);
		return Promise.reject(e);
	}
}