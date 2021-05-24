import { useCallback, useEffect, useState } from 'react';
import Parser from 'rss-parser';
import { NewsData } from 'types/models/Crypto';
import { Feed } from "types/rss/feed.interface";
import { FeedItem } from "types/rss/feedItem.interface";

interface Props {
  limit: number
}

function useNews({limit}: Props) {

  const [data, setData] = useState<FeedItem[]>();
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
  const url = new URL(`${CORS_PROXY}https://cointelegraph.com.br/rss`);

	useEffect(useCallback(() => {
    const parser = new Parser<Feed, FeedItem>({
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT x.y; Win64; x64; rv:10.0) Gecko/20100101 Firefox/10.0",
      },
      requestOptions: {
        rejectUnauthorized: false,
      }
    });
    
    parser.parseURL(url.toString())
      .then(e => {
        setData(e.items.slice(0, (e.items.length > limit) ? limit : e.items.length));
      })
      .catch(e => {
        setError(e.message);
      })
      .finally(() => {
        setLoading(false);
      })
  },[]), []);

  return {loading, error, data};
}

export default useNews;