import { BigNumber } from "@0x/utils";

interface Transaction {
	hash: string;
	gasValue: BigNumber;
	gasPrice: BigNumber;
	gas: number;
};
interface BaseCurrency {
	name: string;
	symbol: string;
	address: string;
};
interface QuoteCurrency extends BaseCurrency { }
export interface DexTradeTransaction {
	transaction: Transaction;
	exchange: {
		name: string;
	};
	tradeIndex: string;
	date: {
		date: string;
	};
	timeInterval: {
		second: string;
	}
	block: {
		height: number;
	};
	side: string;
	baseAmount: BigNumber;
	baseAmountInUsd: BigNumber;
	baseCurrency: BaseCurrency;
	quoteAmount: BigNumber;
	quoteAmountInUsd: BigNumber;
	quotePrice: BigNumber;
	quoteCurrency: QuoteCurrency;
	tradeAmount: BigNumber;
	tradeAmountIsUsd: BigNumber;
}