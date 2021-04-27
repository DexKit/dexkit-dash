import { useState, useEffect } from "react";
import { GET_NETWORK_NAME, EXCHANGE } from "shared/constants/Bitquery";
import { PairInfoExplorer } from "types/app";


import { useChainId } from "./useChainId";
import { getPairExplorer } from "services/graphql/bitquery/protocol";

/**
 * hook to use to fetch related AMM protocols data
 * @param address 
 * @param exchange 
 */
export const usePairExplorer = (baseAddress: string , quoteAddress: string | null, exchange: EXCHANGE) =>{
    const {currentChainId } = useChainId()

    const [isLoadingInfo, setIsLoadingInfo] = useState(false);
    const [infoData, setInfoData] = useState<PairInfoExplorer>();

   
    useEffect(() => {
        setIsLoadingInfo(true);
        getPairExplorer(GET_NETWORK_NAME(currentChainId), exchange, baseAddress, quoteAddress)
            .then(info => { setInfoData(info);  setIsLoadingInfo(false) })
            .catch(e => setIsLoadingInfo(false))
     
       }, [baseAddress, quoteAddress, currentChainId]);


    return {isLoadingInfo, infoData}
}