import { useState, useEffect } from "react";
import { GET_NETWORK_NAME } from "shared/constants/Bitquery";
import { PairInfoExplorer } from "types/app";

import { EXCHANGE } from "shared/constants/AppEnums";
import { useChainId } from "./useChainId";
import { getTokenPairDaily } from "services/graphql/bitquery/protocol";

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
        getTokenPairDaily(GET_NETWORK_NAME(currentChainId), exchange, baseAddress, quoteAddress)
            .then(info => {console.log(info); setInfoData(info);  setIsLoadingInfo(false) })
            .catch(e => {console.log(e); setIsLoadingInfo(false)})
     
       }, [baseAddress, quoteAddress, currentChainId]);


    return {isLoadingInfo, infoData}
}