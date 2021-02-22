import { PairDayDataGraphResponse } from "types/uniswap";

const TOKENS = [
	'Bit',
	'Ethe',
	'Lite',
	'Mone',
	'Dash'
];

function randomToken(exclude?: string): string {
	const index = Math.round(1 + Math.random() * (5 - 1)) - 1;
	const found = TOKENS.findIndex(t => t === exclude);
	if (index === found) {
		return randomToken(exclude);
	}
	return TOKENS[index];
}

export const MOCK_UNISWAP_PAIRS_DAY_DATA = {
	loading: false,
	error: undefined,
	data: {
		pairDayDatas: Array(10).fill(true)
			.map(d => {
				return {
					id: `${Math.random() * 1000}`,
					token0: {
						id: `${Math.random() * 100}`,
						name: `Token ${Math.round(Math.random() * 10)}`,
						symbol: randomToken(),

					},
					token1: {
						id: `${Math.random() * 100}`,
						name: `Token ${Math.round(Math.random() * 10)}`,
						symbol: randomToken(),

					},
					dailyTxns: Math.round(Math.random() * 100),
					reserveUSD: Math.round(Math.random() * 1000),
					dailyVolumeUSD: Math.round(Math.random() * 1000),
					pairAddress: Math.round(Math.random() * 1000)
				} as PairDayDataGraphResponse
			})
	}
};