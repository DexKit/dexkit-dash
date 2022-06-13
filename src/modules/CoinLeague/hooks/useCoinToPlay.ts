import { ChainId } from "types/blockchain";
import { CoinToPlay, StableCoinToPlay } from "../constants";



export const useCoinToPlay = (chainId?: ChainId, address?: string) => {
    if (!address || !chainId) {
        return
    }
    return CoinToPlay[chainId]?.find(c => c.address.toLowerCase() === address.toLowerCase());

}


export const useCoinToPlayStable = (chainId?: ChainId) => {
    if (!chainId) {
        return
    }
    return StableCoinToPlay[chainId]

}