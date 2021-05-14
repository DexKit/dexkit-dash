import { TokenInfo } from '@types';
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
		'Access-Control-Allow-Origin': '*',
	},
});
// We cache tokens here
let ethTokens: TokenInfo[] | undefined
export async function getEthereumTokens(): Promise<TokenInfo[]> {
	if(ethTokens){
		return ethTokens;
	}
	try {
		const response = await ethereumTokens.get('/uniswap/all.json');
		ethTokens = response.data.tokens;
		return Promise.resolve(response.data.tokens);
	} catch (e) {
		return Promise.reject(e);
	}
}
// We cache tokens here
let binTokens: TokenInfo[] | undefined
export async function getBinanceTokens(): Promise<TokenInfo[]> {
	if(binTokens){
		return binTokens;
	}
	try {
		const response = await binanceTokens.get('/pancakeswap/pancake-swap-interface-v1/master/src/constants/token/pancakeswap.json');
		binTokens = response.data.tokens;
		return Promise.resolve(response.data.tokens);
	} catch (e) {
		return Promise.reject(e);
	}
}
