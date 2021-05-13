import { useWeb3 } from "./useWeb3"
import { useState, useEffect } from "react";
import { ChainId } from "types/blockchain";



/**
 * Sometimes user has a different chainId than the one on the wallet
 */
export const useChainId = () =>{
    const {chainId} = useWeb3();
    const [userChainId, setUserChainId] = useState<ChainId>(ChainId.Mainnet);
    const [currentChainId, setCurrentChainId] = useState<ChainId>(ChainId.Mainnet);
    const [isMismatch, setIsMismatch] = useState<boolean>(false);
    useEffect(()=> {
        if(chainId && userChainId){
            setCurrentChainId(chainId);
            if(chainId !== userChainId){
                setIsMismatch(true);
            }else{
                setIsMismatch(false);
            }
            

        }
    }, [chainId, userChainId])

    return {currentChainId, isMismatch, setUserChainId}

}