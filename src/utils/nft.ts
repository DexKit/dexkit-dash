import {ChainId} from 'types/blockchain';

export function slugToChainId(slug: string): number {
  switch (slug) {
    case 'ethereum':
      return ChainId.Mainnet;
    case 'bsc':
      return ChainId.Binance;
    case 'matic':
      return ChainId.Matic;
    case 'ropsten':
      return ChainId.Ropsten;
    case 'rinkeby':
      return ChainId.Rinkeby;
    case 'goerli':
      return ChainId.Goerli;
    case 'bsc-testnet':
      return ChainId.BinanceTest;
    case 'mumbai':
      return ChainId.Mumbai;
    case 'kovan':
      return ChainId.Kovan;
    default:
      return -1;
  }
}

export function chainIdToSlug(chainId: number): string {
  switch (chainId) {
    case ChainId.Mainnet:
      return 'ethereum';
    case ChainId.Binance:
      return 'bsc';
    case ChainId.Matic:
      return 'matic';
    case ChainId.Ropsten:
      return 'ropsten';
    case ChainId.Rinkeby:
      return 'rinkeby';
    case ChainId.Goerli:
      return 'goerli';
    case ChainId.BinanceTest:
      return 'bsc-testnet';
    case ChainId.Mumbai:
      return 'mumbai';
    case ChainId.Kovan:
      return 'kovan';
    default:
      return '';
  }
}
