import { ChainId } from "types/blockchain";
import { SQUID_LEAGUE_SUPPORTED_NETWORKS } from "../constants";


export const isSupportedBlockchain = (chainId?: ChainId) => {

    return chainId && SQUID_LEAGUE_SUPPORTED_NETWORKS.includes(chainId);

}