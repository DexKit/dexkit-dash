import {
  TransactionConfig,
  TransactionReceipt,
  // PromiEvent 
} from 'web3-core';
import { connectWeb3, closeWeb3, getWeb3, getProvider, web3Transaction,  } from "services/web3modal"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "redux/store";
import { setWeb3State, setEthAccount, setEthBalance, setChainId, setBlockNumber } from "redux/actions";
import { AccountType, Web3State, Network } from "types/blockchain";
import { BigNumber } from "@0x/utils";
import { addAccounts, setAccount } from 'redux/_ui/actions';


// @NOTE: We needed to use this auxiliary variables here to not allow app to call multiple times web3 callbacks, this caused
// the app to break as wallet was being called multiple times. useState inside the hook was not working as solution
let loadingAccount = false;
let loadingChainId = false;
let loadingEthBalance = false;
export const useWeb3 = () => {
  const dispatch = useDispatch<AppDispatch>();
  const web3State = useSelector<AppState, AppState['blockchain']['web3State']>(state => state.blockchain.web3State);
  const ethBalance = useSelector<AppState, AppState['blockchain']['ethBalance']>(state => state.blockchain.ethBalance);
  const account = useSelector<AppState, AppState['blockchain']['ethAccount']>(state => state.blockchain.ethAccount);
  const accounts = useSelector<AppState, AppState['ui']['accounts']>(state => state.ui.accounts);
  const chainId = useSelector<AppState, AppState['blockchain']['chainId']>(state => state.blockchain.chainId)
  const blocknumber = useSelector<AppState, AppState['blockchain']['blockNumber']>(state => state.blockchain.blockNumber)

 
  useEffect(() => {
    const web3 = getWeb3();
    if (web3State === Web3State.Done && web3 && !account && !loadingAccount) {
      // subscribeProvider(provider);
      loadingAccount = true;
      web3.eth.getAccounts().then((a) => {
        const uiAccount = {
          address: a[0],
          label: a[0],
          type: AccountType.EVM,
          network: Network.ethereum
        }

        dispatch(setAccount(uiAccount))
        dispatch(setEthAccount(a[0]));
        dispatch(addAccounts(
          a.map(ac=> {return {address: ac, label: ac,  type: AccountType.EVM, network: Network.ethereum}}
          )))

      }).finally(() => loadingAccount = false);
    }
    if (web3State === Web3State.Done && web3  && !loadingChainId) {
      loadingChainId = true;
      web3.eth.getChainId().then((n) => {
        dispatch(setChainId(n));
      }).finally(() =>  loadingChainId = false);
    }

  }, [web3State,  account]);


  useEffect(() => {
    const web3 = getWeb3();
    if (account && web3 && !loadingEthBalance && !ethBalance) {
      loadingEthBalance = true;
      web3.eth.getBalance(account).then((e) =>{
        dispatch(setEthBalance(new BigNumber(e)))
      }).finally(() => loadingEthBalance = false);
    }
  }, [account])


  const onCloseWeb3 = () => {
    const provider = getProvider();
    if (provider) {
      closeWeb3();
      dispatch(setEthAccount(undefined));
      dispatch(setChainId(undefined));
      dispatch(setWeb3State(Web3State.NotConnected));
    }

  }

  
  const onSetDefaultAccount = (index: number) => {
    const web3 = getWeb3();
    if (web3 && accounts) {
      web3.eth.defaultAccount = accounts[index].address;
      dispatch(setEthAccount(accounts[index].address));
    }
  }


  const onConnectWeb3 = () => {
    const web3 = getWeb3();
    if (!web3) {
      dispatch(setWeb3State(Web3State.Connecting));

      connectWeb3()
        .then((p) => {
          subscribeProvider(p);
          dispatch(setWeb3State(Web3State.Done));

        }).catch(() => {
          dispatch(setWeb3State(Web3State.Error));
        });
    }
  }


  function onActionWeb3Transaction(transactionConfig: TransactionConfig): Promise<TransactionReceipt> {
    return new Promise<TransactionReceipt>((resolve, reject) => {
      const transaction = web3Transaction(transactionConfig);
      if (transaction != null) {
     //   dispatch(setWeb3State(Web3State.Connecting));
        transaction.then(transaction => {
       //   dispatch(setWeb3State(Web3State.Done));
          resolve(transaction)
        })
        .catch(e => {
         // dispatch(setWeb3State(Web3State.Error));
          reject(e);
        });
      }
    });
  };


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
      const uiAccount = {
        label: accounts[0],
        address: accounts[0],
        type: AccountType.EVM,
        network: Network.ethereum
      }
      dispatch(setAccount(uiAccount))
      dispatch(setEthAccount(accounts[0]));
    });

    pr.on("chainChanged", async (chainId: number) => {
      dispatch(setChainId(chainId));
    });


    pr.on("block", (blocknumber: number) => {
      dispatch(setBlockNumber(blocknumber));
    });

    /*provider.on("networkChanged", async (networkId: number) => {
      const chainId = await web3.eth.chainId();
      await this.setState({ chainId, networkId });
      await this.getAccountAssets();
    });*/
  };

  
  return { onConnectWeb3, getWeb3, account, chainId, blocknumber, ethBalance, web3State, onCloseWeb3, getProvider, onActionWeb3Transaction, onSetDefaultAccount }

}