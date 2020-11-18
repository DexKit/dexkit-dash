import { connectWeb3, closeWeb3, getWeb3, getProvider } from "services/web3modal"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "redux/store";
import { setWeb3State, setEthAccount, setEthBalance, setChainId } from "redux/actions";
import { Web3State } from "types/ethereum";
import { BigNumber } from "@0x/utils";

export enum Web3Status{
    Not_Connected,
    Connecting,
    Connected,
    Failure
}


export const useWeb3 = () => {
    const dispatch = useDispatch<AppDispatch>();
    const web3State = useSelector<AppState, AppState['blockchain']['web3State']>(state => state.blockchain.web3State);
    const ethBalance = useSelector<AppState, AppState['blockchain']['ethBalance']>(state => state.blockchain.ethBalance);
    const account = useSelector<AppState, AppState['blockchain']['ethAccount']>(state => state.blockchain.ethAccount);
    const chainId = useSelector<AppState, AppState['blockchain']['chainId']>(state => state.blockchain.chainId)

    const onCloseWeb3 = () => {
        const provider = getProvider();
        if(provider){
           closeWeb3();
           dispatch(setEthAccount(undefined));
           dispatch(setChainId(undefined));
           dispatch(setWeb3State(Web3State.NotConnected));
        }
            
    }

    const onConnectWeb3 = () => {
        const web3 = getWeb3();
        if(!web3){
            dispatch(setWeb3State(Web3State.Connecting));      
            connectWeb3()
            .then((p) => { 
                subscribeProvider(p);
                dispatch(setWeb3State(Web3State.Done));
            
            }).catch(()=> {
                dispatch(setWeb3State(Web3State.Error));
            });
       }
    }
    useEffect(()=> {
        const web3 = getWeb3();
        if(web3State === Web3State.Done && web3 ){
       
            web3.eth.getChainId().then((n)=> dispatch(setChainId(n)));
           
            web3.eth.getAccounts().then((a)=>  dispatch(setEthAccount(a[0])));
        }
    }, [web3State]);
    

    useEffect(()=>{
        const web3 = getWeb3();
        if(account && web3){
            web3.eth.getBalance(account).then((e)=> 
            dispatch(setEthBalance(new BigNumber(e))));
            
        }
    }, [account])

    const subscribeProvider = async (pr: any) => {
        if (!pr.on) {
          return;
        }
        pr.on("close", () => {
            dispatch(setEthAccount(undefined));
            dispatch(setChainId(undefined));
            closeWeb3();
            dispatch(setWeb3State(Web3State.NotConnected));
         }    
        );
        pr.on("accountsChanged", async (accounts: string[]) => {
            dispatch(setEthAccount(accounts[0]));
        });
        pr.on("chainChanged", async (chainId: number) => {
            dispatch(setChainId(chainId));
        });
    
        /*provider.on("networkChanged", async (networkId: number) => {
          const chainId = await web3.eth.chainId();
          await this.setState({ chainId, networkId });
          await this.getAccountAssets();
        });*/
      };
    

    return {onConnectWeb3, getWeb3, account, chainId, ethBalance, web3State, onCloseWeb3, getProvider }

}