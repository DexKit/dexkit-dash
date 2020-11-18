

export interface TokenGraphResponse{
    id:string;
    name:string;
    symbol: string;
    decimals: number;
    derivedETH: number;
    tradeVolumeUSD: number;
    totalLiquidity: number;
}


export interface TokenDayDataGraphResponse {
    id:string;
    token: TokenGraphResponse,
    dailyVolumeToken: number;
    dailyVolumeETH: number;
    dailyVolumeUSD: number;
    dailyTxns: number;
    totalLiquidityToken: number;
    totalLiquidityETH: number;
    totalLiquidityUSD: number;
    priceUSD: number;
}

export interface PairDayDataGraphResponse {
    id:string;
    token0: {
        id: string,
        name: string,
        symbol: string,
    },
    token1: {
        id: string,
        name: string,
        symbol: string,
    },
    pairAddress: number;
    reserveUSD: number;
    dailyVolumeUSD: number;
    dailyTxns: number;
}