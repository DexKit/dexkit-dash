import axios from 'axios';
import { CoinDetailCoinGecko } from 'types/coingecko';

const COINGECKO_URL = 'https://api.coingecko.com/api/v3/coins/';

const coinGecko = axios.create({
	baseURL: COINGECKO_URL,
	headers: {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*',
	},
});

type errorHandler = (name: any) => void;
async function getCoingecko(url: string, callbackError: errorHandler): Promise<CoinDetailCoinGecko> {
	try {
		const data: CoinDetailCoinGecko = await coinGecko.get(url);
		return Promise.resolve(data);
	} catch (e) {
		return Promise.reject(callbackError(e));
	}
}

export async function getDexkit(callbackError: errorHandler): Promise<CoinDetailCoinGecko> {
	return getCoingecko('dexkit', callbackError);
}

export async function getBitcoin(callbackError: errorHandler): Promise<CoinDetailCoinGecko> {
	return getCoingecko('bitcoin', callbackError);
}

export async function getEthereum(callbackError: errorHandler): Promise<CoinDetailCoinGecko> {
	return getCoingecko('ethereum', callbackError);
}
