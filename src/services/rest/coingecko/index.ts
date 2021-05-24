import axios from 'axios';
import { COINGECKO_URL } from 'shared/constants/AppConst';
import { CoinDetailCoinGecko, CoinItemCoinGecko, CoinListItemCoingecko } from 'types/coingecko';

const coinGecko = axios.create({
	baseURL: COINGECKO_URL,
	headers: {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*',
	},
});

async function getCoingecko(url: string){
	try {
		const response = await coinGecko.get(url);
		return Promise.resolve(response.data);
	} catch (e) {
		return Promise.reject(e);
	}
}

export async function getOverviewCoinsData(currency: string = 'usd'): Promise<CoinItemCoinGecko[]> {
	return getCoingecko(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=dexkit,bitcoin,ethereum&sparkline=true`);
}

export async function getDexkit(): Promise<CoinDetailCoinGecko> {
	return getCoingecko('dexkit?sparkline=true');
}

export async function getBitcoin(): Promise<CoinDetailCoinGecko> {
	return getCoingecko('bitcoin?sparkline=true');
}

export async function getEthereum(): Promise<CoinDetailCoinGecko> {
	return getCoingecko('ethereum?sparkline=true');
}

export async function getAllCoinsId(): Promise<CoinListItemCoingecko[]> {
	return getCoingecko(`list?include_platform=true`);
}

export async function getToken(address: string): Promise<CoinDetailCoinGecko> {
	return getCoingecko(`ethereum/contract/${address.toLowerCase()}?sparkline=true`);
}

export async function getCoinsData(ids: string, currency: string = 'usd'): Promise<CoinItemCoinGecko[]> {
	return getCoingecko(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${ids}&sparkline=true`);
}

let coingeckoIdTokens: CoinListItemCoingecko[]; 

export async function getTokens(address: string[]): Promise<{ [address: string]:  CoinItemCoinGecko}> {

	if(!coingeckoIdTokens){
		coingeckoIdTokens = await getAllCoinsId();
	}
	const geckoData  = coingeckoIdTokens.filter(c=> c.platforms.ethereum).map(c=> { return {address: c.platforms.ethereum?.toLowerCase() as string, id: c.id }});
	// get only coins with active coingecko id
	const geckoIds = geckoData.filter(a=> address.map(ad=>ad.toLowerCase()).includes(a.address.toLowerCase())).map(a=> a.id);
	const concatId = `ethereum,${geckoIds.reduce((p,c)=> `${p},${c}`)}`;
	const coinsUsd = await getCoinsData(concatId);
	//const coinsNative = await getCoinsData(concatId, 'eth');

	const allCoins = geckoData.concat({address: 'eth', id: 'ethereum'});

	return allCoins.reduce<any>((acc, current) => {
		acc[current.address ?? 'eth'] = coinsUsd.find(c=> c.id === current.id);
		// acc[current.address ?? 'eth'].currency_native = coinsNative.find(c=> c.id === current.id);
		return acc;
	}, {});
}
