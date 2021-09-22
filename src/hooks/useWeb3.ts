import {
  TransactionConfig,
  TransactionReceipt,
  // PromiEvent
} from 'web3-core';
import {
  connectWeb3,
  closeWeb3,
  getWeb3,
  getProvider,
  web3Transaction,
  setProvider,
} from 'services/web3modal';
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, AppState} from 'redux/store';
import {
  setWeb3State,
  setEthAccount,
  setEthBalance,
  setChainId,
  setBlockNumber,
} from 'redux/actions';
import {SupportedNetworkType, Web3State} from 'types/blockchain';
import {BigNumber} from '@0x/utils';
import {addAccounts, setDefaultAccount} from 'redux/_ui/actions';
import {useQuery} from 'react-query';
import { useHistory } from 'react-router-dom';

export const useWeb3 = () => {
  const dispatch = useDispatch<AppDispatch>();
  const history = useHistory();
  const web3State = useSelector<AppState, AppState['blockchain']['web3State']>(
    (state) => state.blockchain.web3State,
  );
  const ethBalance = useSelector<
    AppState,
    AppState['blockchain']['ethBalance']
  >((state) => state.blockchain.ethBalance);
  const account = useSelector<AppState, AppState['blockchain']['ethAccount']>(
    (state) => state.blockchain.ethAccount,
  );
  const accounts = useSelector<AppState, AppState['ui']['wallet']>(
    (state) => state.ui.wallet,
  );
  const chainId = useSelector<AppState, AppState['blockchain']['chainId']>(
    (state) => state.blockchain.chainId,
  );
  const blocknumber = useSelector<
    AppState,
    AppState['blockchain']['blockNumber']
  >((state) => state.blockchain.blockNumber);

  const chainIdQuery = useQuery(['GetChainID', web3State], () => {
    const web3 = getWeb3();
    if (web3 && web3State === Web3State.Done) {
      return web3.eth.getChainId();
    }
  });

  const accountsQuery = useQuery(['GetWeb3Accounts', web3State], () => {
    const web3 = getWeb3();
    if (web3 && web3State === Web3State.Done) {
      return web3.eth.getAccounts();
    }
  });

  const ethBalanceQuery = useQuery(
    ['GetWeb3Balance', web3State, account],
    () => {
      const web3 = getWeb3();
      if (web3 && web3State === Web3State.Done && account) {
        return web3.eth.getBalance(account);
      }
    },
  );

  useEffect(() => {
    if (accountsQuery.data) {
      const a = accountsQuery.data;
      const accounts = a.map((ac) => {
        return {address: ac, label: ac, networkType: SupportedNetworkType.evm};
      });
      dispatch(setEthAccount(a[0]));
      dispatch(
        addAccounts({accounts: accounts, type: SupportedNetworkType.evm}),
      );
    }
  }, [accountsQuery.data]);

  useEffect(() => {
    if (chainIdQuery.data) {
      dispatch(setChainId(chainIdQuery.data));
    }
  }, [chainIdQuery.data]);

  useEffect(() => {
    if (ethBalanceQuery.data) {
      dispatch(setEthBalance(new BigNumber(ethBalanceQuery.data)));
    }
  }, [ethBalanceQuery.data]);

  const onCloseWeb3 = () => {
    const provider = getProvider();
 
    if (provider) {
      dispatch(setEthAccount(undefined));
      dispatch(setChainId(undefined));
      dispatch(setWeb3State(Web3State.NotConnected));
      closeWeb3().then(() => {
        dispatch(setEthAccount(undefined));
        dispatch(setChainId(undefined));
        dispatch(setWeb3State(Web3State.NotConnected));
      }).catch(console.log);
    }
  };

  const onSetDefaultAccount = (index: number) => {
    const web3 = getWeb3();
    if (web3 && accounts) {
      web3.eth.defaultAccount =
        accounts[SupportedNetworkType.evm][index].address;
      dispatch(
        setEthAccount(accounts[SupportedNetworkType.evm][index].address),
      );
    }
  };

  const onConnectWeb3 = () => {
    const web3 = getWeb3();
    if (!web3) {
      dispatch(setWeb3State(Web3State.Connecting));

      connectWeb3()
        .then((p) => {
          subscribeProvider(p);
          dispatch(setWeb3State(Web3State.Done));
        })
        .catch(() => {
          dispatch(setWeb3State(Web3State.Error));
        });
    }
  };
  // Used to reconnect again, even if provider already exists
  const forceWeb3Connect = () => {
    dispatch(setWeb3State(Web3State.Connecting));
    connectWeb3()
      .then((p) => {
        subscribeProvider(p);
        dispatch(setWeb3State(Web3State.Done));
      })
      .catch(() => {
        dispatch(setWeb3State(Web3State.Error));
      });
  };

  function onActionWeb3Transaction(
    transactionConfig: TransactionConfig,
  ): Promise<TransactionReceipt> {
    return new Promise<TransactionReceipt>((resolve, reject) => {
      const transaction = web3Transaction(transactionConfig);
      if (transaction != null) {
        //   dispatch(setWeb3State(Web3State.Connecting));
        transaction
          .then((transaction) => {
            //   dispatch(setWeb3State(Web3State.Done));
            resolve(transaction);
          })
          .catch((e) => {
            // dispatch(setWeb3State(Web3State.Error));
            reject(e);
          });
      }
    });
  }

  const subscribeProvider = async (pr: any) => {
    if (!pr.on) {
      return;
    }

    pr.on('close', () => {
      dispatch(setEthAccount(undefined));
      dispatch(setChainId(undefined));
      closeWeb3().then(() => {
        dispatch(setWeb3State(Web3State.NotConnected));
      });
    });

    pr.on('accountsChanged', async (accounts: string[]) => {
      dispatch(setEthAccount(accounts[0]));
    });

    pr.on('chainChanged', async (chainId: number) => {
      console.log('called chain ID changed');
      dispatch(setChainId(chainId));
    });

    pr.on('block', (blocknumber: number) => {
      dispatch(setBlockNumber(blocknumber));
    });

    pr.on('networkChanged', async (networkId: number) => {
      dispatch(setChainId(networkId));
    });
  };

  return {
    onConnectWeb3,
    forceWeb3Connect,
    getWeb3,
    account,
    chainId,
    blocknumber,
    ethBalance,
    web3State,
    accountsQuery,
    ethBalanceQuery,
    chainIdQuery,
    onCloseWeb3,
    getProvider,
    setProvider,
    onActionWeb3Transaction,
    onSetDefaultAccount,
  };
};
