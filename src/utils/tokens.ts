import { BigNumber } from '@0x/utils';
import { isWeth } from './knownTokens';


export const tokenAmountInUnitsToBigNumber = (amount: BigNumber, decimals: number): BigNumber => {
    const decimalsPerToken = new BigNumber(10).pow(decimals);
    return amount.div(decimalsPerToken);
};

export const tokenAmountInUnits = (amount: BigNumber, decimals: number = 18, toFixedDecimals = 2): string => {
    return tokenAmountInUnitsToBigNumber(amount, decimals).toFixed(Number(toFixedDecimals));
};

export const unitsInTokenAmount = (units: string, decimals: number): BigNumber => {
    const decimalsPerToken = new BigNumber(10).pow(decimals);
    return new BigNumber(units).multipliedBy(decimalsPerToken);
};

export const formatTokenSymbol = (symbol: string): string => {
    return isWeth(symbol.toLowerCase()) ? 'ETH' : symbol.toUpperCase();
};

export const tokenSymbolToDisplayString = (symbol: string): string => {
    return isWeth(symbol) ? 'wETH' : symbol.toUpperCase();
};