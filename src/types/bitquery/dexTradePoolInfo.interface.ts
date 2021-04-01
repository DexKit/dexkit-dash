export interface DexTradePoolInfo{
    timeInterval: Date;
    baseCurrency: { symbol: string, address: string};
    baseAmount: number;
    baseAmountInUSD: number;
    quoteCurrency: { symbol: string, address: string};
    quoteAmount: number;
    quoteAmountInUSD: number;
    trades: number;
    quotePrice: number;
    maximum_price: number;
    minimum_price: number;
    open_price: number;
    close_price: number;
    tradeAmount: number;
    tradeAmountInUSD: number;
}