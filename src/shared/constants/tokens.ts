import { ChainId } from "types/blockchain";
import { Token } from "types/app";

const WETH: Token = {
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    chainId: ChainId.Mainnet,
    name: 'Wrapped ETH',
    symbol: 'WETH',
    decimals: 18,
    logoURI: ''
}

const DEXKIT_ETH: Token = {
    address: '0x7866E48C74CbFB8183cd1a929cd9b95a7a5CB4F4',
    chainId: ChainId.Mainnet,
    name: 'DexKit',
    symbol: 'KIT',
    decimals: 18,
    logoURI: ''
}
// a list of tokens by chain
type ChainTokenList = {
    readonly [chainId in ChainId]: Token
  }

/*const WETH_ONLY: ChainTokenList = {
    [ChainId.Mainnet]: [WETH],

}*/

export const DEXKIT: Partial<ChainTokenList> = {
    [ChainId.Mainnet]: DEXKIT_ETH,
}

