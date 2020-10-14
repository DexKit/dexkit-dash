import { connectWeb3 } from "services/web3modal"
import { useState, useEffect } from "react";
import Web3 from 'web3';


export const useWeb3 = () => {
    const [web3, setWeb3] = useState<undefined | Web3>();
    const [ethBalance, setEthBalance] = useState<undefined | string>();
    const [account, setAccount] = useState<undefined | string>();
    const [chainId, setChainId] = useState<undefined | number>();

    const onConnectWeb3 = () => {
        if(!web3){
            connectWeb3()
            .then((p) => { 
                subscribeProvider(p);
                initWeb3(p);
            
            }).catch(console.log);
       }
    }
    
    const initWeb3 = (p:any) => {
        const w3 = new Web3(p)
        setWeb3(w3);
        if(w3){
            w3.eth.getChainId().then((n)=> setChainId(n))
            w3.eth.getAccounts().then((a)=> setAccount(a[0]));
        }    
    }
    
    useEffect(()=>{
        if(account && web3){
            web3.eth.getBalance(account).then((e)=> setEthBalance(e));
        }
    },[account, web3])

    const subscribeProvider = async (provider: any) => {
        if (!provider.on) {
          return;
        }
        provider.on("close", () => {
            setWeb3(undefined);
            setAccount(undefined);
            setChainId(undefined);
         }    
        );
        provider.on("accountsChanged", async (accounts: string[]) => {
            console.log(accounts);
            setAccount(accounts[0]);
        });
        provider.on("chainChanged", async (chainId: number) => {
            setChainId(chainId);
        });
    
        /*provider.on("networkChanged", async (networkId: number) => {
          const chainId = await web3.eth.chainId();
          await this.setState({ chainId, networkId });
          await this.getAccountAssets();
        });*/
      };
    

    return {onConnectWeb3, web3, account, chainId, ethBalance }

}