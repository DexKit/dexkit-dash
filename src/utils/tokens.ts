import { BigNumber } from '@0x/utils';
import { isWeth } from './knownTokens';
import { ChainId } from 'types/blockchain';
import { TokenInfo } from '@types';
import Web3 from 'web3';
import { GET_DEFAULT_QUOTE } from 'shared/constants/Blockchain';


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

export const isNativeCoin = (symbol: string, chainId: ChainId) => {
    switch (chainId) {
        case ChainId.Mainnet:
        case ChainId.Ropsten:
        case ChainId.Kovan:
        case ChainId.Goerli:
        case ChainId.Rinkeby:
        case ChainId.Ganache:
          return symbol.toLowerCase() === 'eth';
        case ChainId.BinanceTest:
        case ChainId.Binance:
          return symbol.toLowerCase() === 'bnb';
    }
}

export const filterTokensInfoByString = (tokens: TokenInfo[], str: string): TokenInfo[] => {
    return tokens.filter(token => {
        return token.symbol.toLowerCase().indexOf(str.toLowerCase()) !== -1 || token.name.toLowerCase().indexOf(str.toLowerCase()) !== -1;
    });
};


export const getNativeCoinWrapped = (chainId: ChainId) => {
    switch (chainId) {
        case ChainId.Mainnet:
        case ChainId.Ropsten:
        case ChainId.Kovan:
        case ChainId.Goerli:
        case ChainId.Rinkeby:
        case ChainId.Ganache:
          return 'weth';
        case ChainId.BinanceTest:
        case ChainId.Binance:
          return 'wbnb';
    }
}

export const getNativeCoinWrappedAddress = (chainId: ChainId) => {
    switch (chainId) {
        case ChainId.Mainnet:
        case ChainId.Ropsten:
        case ChainId.Kovan:
        case ChainId.Goerli:
        case ChainId.Rinkeby:
        case ChainId.Ganache:
          return '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
        case ChainId.BinanceTest:
        case ChainId.Binance:
          return '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
    }
}

export const extractPairFromAddress = (address: string, chainId: ChainId) => {
    const splittedAddress = address.split('-');
    let baseAddress = splittedAddress[0] || GET_DEFAULT_QUOTE(chainId) as string;
    let quoteAddress = null;
    if(splittedAddress.length > 1){
      baseAddress = splittedAddress[0];
      quoteAddress = splittedAddress[1];
      if(!Web3.utils.isAddress(quoteAddress)){
        quoteAddress = GET_DEFAULT_QUOTE(chainId);
      }
    }
    return {baseAddress, quoteAddress};
  }