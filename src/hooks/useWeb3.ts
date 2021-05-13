import {
  TransactionConfig,
  TransactionReceipt,
  // PromiEvent 
} from 'web3-core';
import { connectWeb3, closeWeb3, getWeb3, getProvider, web3Transaction } from "services/web3modal"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "redux/store";
import { setWeb3State, setEthAccount, setEthBalance, setChainId, setBlockNumber, setEthAccounts } from "redux/actions";
import { Web3State } from "types/blockchain";
import { BigNumber } from "@0x/utils";


export const useWeb3 = () => {
  const dispatch = useDispatch<AppDispatch>();
  const web3State = useSelector<AppState, AppState['blockchain']['web3State']>(state => state.blockchain.web3State);
  const ethBalance = useSelector<AppState, AppState['blockchain']['ethBalance']>(state => state.blockchain.ethBalance);
  const account = useSelector<AppState, AppState['blockchain']['ethAccount']>(state => state.blockchain.ethAccount);
  const accounts = useSelector<AppState, AppState['blockchain']['ethAccounts']>(state => state.blockchain.ethAccounts);
  const chainId = useSelector<AppState, AppState['blockchain']['chainId']>(state => state.blockchain.chainId)
  const blocknumber = useSelector<AppState, AppState['blockchain']['blocknumber']>(state => state.blockchain.blocknumber)

  
  useEffect(() => {
    const web3 = getWeb3();
    const provider = getProvider();
    
    if (web3State === Web3State.Done && web3) {

      web3.eth.getChainId().then((n) => {
        dispatch(setChainId(n));
      });

      // subscribeProvider(provider);

      web3.eth.getAccounts().then((a) => {
        dispatch(setEthAccount(a[0]));
        dispatch(setEthAccounts(a))
      });
    }
  }, [web3State]);


  useEffect(() => {
    const web3 = getWeb3();
    if (account && web3) {
      web3.eth.getBalance(account).then((e) =>{
        dispatch(setEthBalance(new BigNumber(e)))
      });
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
      web3.eth.defaultAccount = accounts[index];
      dispatch(setEthAccount(accounts[index]));
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
      dispatch(setEthAccounts([]));
      dispatch(setChainId(undefined));
      closeWeb3();
      dispatch(setWeb3State(Web3State.NotConnected));
    }
    );

    pr.on("accountsChanged", async (accounts: string[]) => {
      dispatch(setEthAccount(accounts[0]));
      dispatch(setEthAccounts(accounts));
    });

    pr.on("chainChanged", async (chainId: number) => {
      dispatch(setChainId(chainId));
    });


    pr.on("block", (blocknumber: number) => {
      console.log('blocknumber', blocknumber);
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