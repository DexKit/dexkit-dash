import { URL } from "url";

export interface FeedEnclosure{
    url: string | URL;
    length?: number;
    type?: string;
}