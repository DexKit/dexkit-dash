import { ChainId } from "types/blockchain";
import { TokenInfo } from "@types";

const WETH: TokenInfo = {
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    chainId: ChainId.Mainnet,
    name: 'Wrapped ETH',
    symbol: 'WETH',
    decimals: 18,
    logoURI: ''
}
// a list of tokens by chain
type ChainTokenList = {
    
    readonly [chainId in ChainId]: TokenInfo[]
  }

/*const WETH_ONLY: ChainTokenList = {
    [ChainId.Mainnet]: [WETH],

}*/


