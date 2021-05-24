import { FeedEnclosure } from "./feedEnclosure.interface";

export interface FeedItem{
    creator?: string;
    title?: string,
    link?: string;
    pubDate?: Date;
    enclosure?: FeedEnclosure;
    "dc:creator"?: string;
    content?: string;
    contentSnippet?: string;
    guid?: string;
    categories?: string[] | any[];
    isoDate?: Date;
}