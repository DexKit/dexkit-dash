import { useWeb3 } from "hooks/useWeb3";
import { useEffect, useState } from "react";
import { getMulticall,  getTokenBalances } from "services/multicall";
import { Web3State } from "types/blockchain";


export const useMulticallTokenBalances = (tokens?: string[], account?: string) => {
    const {web3State} = useWeb3();
    const [tokenBalances, setTokenBalances] = useState<any>();

    useEffect(()=> {
        if(web3State !== Web3State.Done){
            return;
        }
        if(!account || !tokens){
            return;
        }
       getTokenBalances(tokens, account)
       .then(t => setTokenBalances(t));

    }, [web3State, account, tokens])

    return tokenBalances;


  
}