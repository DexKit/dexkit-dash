import { ChainId } from "types/blockchain";
import { NFT_LEAGUE_SUPPORTED_NETWORKS } from "../constants";


export const isSupportedBlockchain = (chainId?: ChainId) => {
    return chainId && NFT_LEAGUE_SUPPORTED_NETWORKS.includes(chainId);
}