import { useState, useEffect } from "react";
import { Token } from "types/app";
import { useWeb3 } from "./useWeb3";
import { getTokenInfo } from "services/graphql/bitquery";
import { GET_NETWORK_NAME } from "shared/constants/Bitquery";




export const useTokenInfo = (address: string) => {

    const [tokenInfo, setTokenInfo] = useState<Token>();
    const [isLoading, setIsLoading] = useState(false);
    const {chainId} = useWeb3();
  
    useEffect(() => {
      setTokenInfo(undefined);
      setIsLoading(true);
      getTokenInfo(GET_NETWORK_NAME(chainId), address)
        .then(data =>{setIsLoading(false); setTokenInfo(data)})
        .catch(e => setIsLoading(false))
    }, [address]);


    return {tokenInfo, isLoading};


}