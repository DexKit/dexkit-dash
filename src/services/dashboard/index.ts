import { OverviewDataProvider } from "modules/dashboard/Overview";
import { ReportCards } from "types/models/Ecommerce";
import { getDexkit, getBitcoin, getEthereum } from 'services/rest/coingecko/';
import Parser from 'rss-parser';
import { Feed } from "types/rss/feed.interface";
import { FeedItem } from "types/rss/feedItem.interface";


export async function GetFeed(url: URL): Promise<Feed>{
	const parser = new Parser<Feed, FeedItem>({
		// customFields: {
		//   item: [
		//     ['media:content', 'media:content', {keepArray: true}],
		//   ]
		// },
		headers: {
			// o servidor rejeita requisições sem este cabeçalho
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


export class OverviewDataProviderImp implements OverviewDataProvider {
	async getReportCardsData(): Promise<ReportCards[]> {
		try {
			const dexkit = await getDexkit();
			const bitcoin = await getBitcoin();
			const ethereum = await getEthereum();
			return [dexkit, bitcoin, ethereum]
				.map(d => {
					console.log('icon', d?.image?.thumb);
					const obj: ReportCards = {
						id: Math.random(),
						icon: d?.image?.thumb ?? '/assets/images/dashboard/icon_revenue.png',
						type: d?.name,
						strokeColor: '#0A8FDC',
						value: `$${d?.market_data?.current_price['usd']?.toFixed(2) ?? 0.00}`,
						growth: d?.market_data?.price_change_percentage_24h,
						graphData: d?.market_data?.sparkline_7d?.price?.map((p,i) => {
							return { month: i.toString(), number: p}
						}) ?? []
					};
					return obj;
				});
		} catch (e) {
			return Promise.reject(e);
		}
	}
}