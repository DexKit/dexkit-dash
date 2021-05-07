import { Currency } from "types/bitquery/currency.interface";




export interface TokenPair{
    baseCurrency: Currency;
    quoteCurrency: Currency;
    trades: number;
    baseAmountInUsd: number;
    quoteAmountInUsed: number;
    maximumPrice: number;
    minimumPrice: number;
    quoteAmount: number;
    baseAmount: number;
    openPrice: number;
    closePrice: number;
    tradeAmount: number;
    tradeAmountInUsd: number;
    protocol: string;
    smartContract: {
        address: {
            address: string;
        }
    }
}