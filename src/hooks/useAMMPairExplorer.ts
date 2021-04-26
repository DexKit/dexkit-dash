import { useState, useEffect } from "react";
import { getLastTradeByPair } from "services/graphql/bitquery";
import { GET_NETWORK_NAME, EXCHANGE } from "shared/constants/Bitquery";
import { AMMPairInfoExplorer } from "types/app";
import { GET_DEFAULT_QUOTE } from "shared/constants/Blockchain";
import Web3 from "web3";
import { useChainId } from "./useChainId";
import { getAMMPairExplorer } from "services/graphql/bitquery/protocol";



/**
 * hook to use to fetch related protocols data
 * @param address 
 * @param exchange 
 */
export const useAMMPairExplorer = (address: string, exchange: EXCHANGE) =>{
    const {currentChainId } = useChainId()

    const [isLoadingInfo, setIsLoadingInfo] = useState(false);
    const [infoData, setInfoData] = useState<AMMPairInfoExplorer>();
    const fetchPairData = (pairAddress: string) =>{ 
        setIsLoadingInfo(true);
        getAMMPairExplorer(GET_NETWORK_NAME(currentChainId), exchange, pairAddress, GET_DEFAULT_QUOTE(currentChainId))
            .then(info => { setInfoData(info);  setIsLoadingInfo(false) })
            .catch(e => setIsLoadingInfo(false))
      }
     
       useEffect(() => {
         if (Web3.utils.isAddress(address)) {
           fetchPairData(address);
         }else{
           // We received a different url structure, parse and get pairAddress
           // TODO: investigate better ways to fetch pair
           const splitAddress = address.split('-');
           if(splitAddress.length > 1 && currentChainId){
             const baseAddress = splitAddress[0];
             getLastTradeByPair(GET_NETWORK_NAME(currentChainId), exchange, baseAddress, GET_DEFAULT_QUOTE(currentChainId))
             .then(pair => fetchPairData(pair))
           }
         }
     
       }, [address, currentChainId]);


    return {isLoadingInfo, infoData}
}