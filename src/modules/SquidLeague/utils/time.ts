import { BigNumber } from "ethers";
import { ChainId } from "types/blockchain";


/**
 * Get last challenge timestamp based on chainId
 * @param lastChallengeTimestamp 
 * @param chainId 
 * @returns 
 */
export const getLastChallengeTimestamp = (lastChallengeTimestamp: BigNumber, chainId?: ChainId) => {
    return lastChallengeTimestamp.toNumber() +
        (chainId && chainId === ChainId.Mumbai
            ? 1200
            : 24 * 3600) || 24 * 3600
}