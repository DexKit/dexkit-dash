import { ChainId, Network } from '@types';
import { CoinIcons } from 'shared/constants/AppEnums';

export const NETWORK_ID: number = Number.parseInt(process.env.REACT_APP_NETWORK_ID as string, 10) || Network.Mainnet;

export const CHAIN_ID: number = process.env.REACT_APP_CHAIN_ID
    ? Number.parseInt(process.env.REACT_APP_CHAIN_ID as string, 10)
    : NETWORK_ID === 50
    ? 1337
    : NETWORK_ID;


export function matchCoinSymbol(symbol: string): string{
    if(symbol.toLocaleLowerCase() === 'bitcoin' || symbol.toLocaleLowerCase() === 'btc'){
        return CoinIcons.BITCOIN_WHITE;
    } else if(symbol.toLocaleLowerCase().search('eth')){
        return CoinIcons.ETHERIUM
    } else if(symbol.toLocaleLowerCase().search('lit') || symbol.toLocaleLowerCase() === 'ltc'){
        return CoinIcons.LITECOIN;
    }
    else if(symbol.toLocaleLowerCase().search('rip')){
        return CoinIcons.RIPPLE;
    }
    else if(symbol.toLocaleLowerCase().search('mon') || symbol.toLocaleLowerCase() === 'xmr'){
        return CoinIcons.BITCOIN_WHITE;
    } 
    else {
        return '';
    }
}


export const TRADE_API_URL = (chainId: ChainId) => {
    switch (chainId) {
        case ChainId.Mainnet:
            return 'https://api.dexkit.com/v4';
        case ChainId.Ropsten:
            return '';
        case ChainId.Kovan:
            return 'https://kovan.api.dexkit.com/v3';
        default:
            return '';
    }
};