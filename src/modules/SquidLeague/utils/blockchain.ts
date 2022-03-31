import { ChainId } from "types/blockchain";


export const isSupportedBlockchain = (chainId?: ChainId) => {

    return chainId === ChainId.Mumbai;

}