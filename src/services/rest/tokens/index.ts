import axios from 'axios';
import { Token } from 'types/app';

const ethereumTokens = axios.create({
	baseURL: 'https://tokens.coingecko.com',
	headers: {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*',
	},
});

const binanceTokens = axios.create({
	baseURL: 'https://raw.githubusercontent.com',
	headers: {
		'Content-Type': 'application/json',
	},
});

export async function getEthereumTokens(): Promise<Token[]> {
	try {
		const response = await ethereumTokens.get('/uniswap/all.json');
		return Promise.resolve(response.data.tokens);
	} catch (e) {
		return Promise.reject(e);
	}
}

export async function getBinanceTokens(): Promise<Token[]> {
	try {
		const response = await binanceTokens.get('/pancakeswap/pancake-swap-interface-v1/master/src/constants/token/pancakeswap.json');
		return Promise.resolve(response.data.tokens);
	} catch (e) {
		return Promise.reject(e);
	}
}
