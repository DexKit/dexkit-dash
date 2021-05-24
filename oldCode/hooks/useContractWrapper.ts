import { useState, useEffect } from "react";
import { getContractWrappers, initContractWrappers } from "services/contract_wrappers";
import { useWeb3 } from "./useWeb3";
import { Web3State } from "types/blockchain";


export const useContractWrapper = () => {
    const {getProvider, chainId, web3State} = useWeb3();
    const [isContractLoaded, setIsContractLoaded] = useState<boolean>(false);
 
    useEffect(()=>{
        const provider = getProvider();
        const contractWrappers = getContractWrappers(chainId);
        if(!contractWrappers && provider && chainId && web3State === Web3State.Done){
            initContractWrappers(provider, chainId)
            setIsContractLoaded(true);
        }else{
            setIsContractLoaded(false);
        }
    }, [chainId, web3State])

    return {getContractWrappers, isContractLoaded}

}