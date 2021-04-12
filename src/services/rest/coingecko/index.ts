import axios from 'axios';
import { CoinDetailCoinGecko } from 'types/coingecko';
import allSettled from 'utils/allsettled';

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

export async function getToken(address: string): Promise<CoinDetailCoinGecko> {
	return getCoingecko(`ethereum/contract/${address.toLowerCase()}?sparkline=true`);
}

export async function getTokens(address: string[]): Promise<{ [address: string]: CoinDetailCoinGecko }> {
	const allPromisses = address.map(e => {
		return (e == '' || e == '-') ? getEthereum() : getToken(e.toLowerCase());
	});

	const result = (await allSettled(allPromisses)).filter(e => e.loaded);
	
	return result.reduce<any>((acc, current) => {
		acc[current.value.contract_address?.toLowerCase() ?? 'eth'] = current.value;
		return acc;
	}, {});
}
