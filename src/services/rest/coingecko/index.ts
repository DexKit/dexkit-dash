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

async function getCoingecko(url: string): Promise<CoinDetailCoinGecko> {
	try {
		const response = await coinGecko.get(url);
		return Promise.resolve(response.data);
	} catch (e) {
		return Promise.reject(e);
	}
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
