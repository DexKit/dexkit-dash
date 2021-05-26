import  { useEffect } from 'react';
import { useWeb3 } from "hooks/useWeb3"
import { web3Modal } from 'services/web3modal';
import { isMobile } from 'web3modal';


export const Web3Manager = () => {
    const { onConnectWeb3 } = useWeb3();
    const {web3, ethereum} = window
    // Try to connect once at begin, check if provider is available and try
    // to connect
    useEffect(() =>{
        if(web3Modal.cachedProvider || (isMobile() && (web3 || ethereum))){
          onConnectWeb3();
          console.log('called');
        }

    }, [])
  

    return null;
}