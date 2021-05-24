import { Token } from "types/app";

export const isZrx = (token: string): boolean => {
    return token === 'zrx';
};

export const isWeth = (token: string): boolean => {
    return token === 'weth';
};

export const isWhackd = (token: string): boolean => {
    return token === 'whackd';
};

export const isWethToken = (token: Token): boolean => {
    if (token.symbol.toLowerCase() === 'weth') {
        return true;
    } else {
        return false;
    }
};