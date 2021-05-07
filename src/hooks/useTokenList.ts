import { useSelector } from "react-redux"
import { AppState } from "redux/store"
import { useEffect, useState } from "react"
import { getCoingeckoTokenList } from "services/tokens"
import { ChainId } from "types/blockchain"
import { TokenList } from "@types"


let tokenList: TokenList ; 
export const useTokenList = () => {
   const chainId = useSelector<AppState, AppState['blockchain']['chainId']>(state => state.blockchain.chainId);
   const [tl, setTl] = useState(tokenList);

   useEffect(() => {
        if(!tokenList){
            getCoingeckoTokenList()
            .then(t => setTl(t))
        }
    }, [])


   useEffect(() => {
       if(chainId === ChainId.Mainnet){
            getCoingeckoTokenList()
            .then(t => setTl(t))
       }
    
   }, [chainId])

   return tl;

}