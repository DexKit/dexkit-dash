import Web3 from 'web3';
import {
  TransactionConfig,
  TransactionReceipt,
  // PromiEvent
} from 'web3-core';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import {Web3Wrapper} from '@0x/web3-wrapper';
import {ethers, providers} from 'ethers';
import { getCachedMagicNetwork, getMagic, isMagicProvider, setIsMagicProvider } from './magic';

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: process.env.REACT_APP_INFURA_ID,
    },
  }
};

const web3Modal = new Web3Modal({
  network: 'mainnet', // optional
  theme: 'dark',
  cacheProvider: true, // optional
  providerOptions, // required
});


let web3: null | Web3;
let provider: any;

const connectWeb3 = async () => {
  provider = await web3Modal.connect();
  setProvider(provider);
  return provider;
};

const closeWeb3 = async () => {
  provider = null;
  web3 = null;
  if(isMagicProvider()){
    const network =  getCachedMagicNetwork();
    const magic = getMagic(network)
    await magic.user.logout();
    setIsMagicProvider('false');
  }
  setIsMagicProvider('false');

  web3Modal.clearCachedProvider();
};

const getProvider = (): any | undefined => {
  if (!provider) {
    return;
  }
  return provider;
};

const setProvider = (_provider: any) => {
    provider = _provider;
    setWeb3();
    setEthers();
};

const getWeb3 = () => {
  if (!provider) {
    return;
  }
  if (!web3) {
    web3 = new Web3(provider);

    return web3;
  }
  return web3;
};

const setWeb3 = () => {
  if (!provider) {
    return;
  }
  web3 = new Web3(provider);

};



let ethersjs: null | ethers.providers.Web3Provider;
const getEthers = () => {
  /*if (!provider) {
    return;
  }
  if (!ethersjs) {
    ethersjs = 
  }*/
  return new providers.Web3Provider(getProvider());
};

const setEthers = () => {
  if (!provider) {
    return;
  }
  ethersjs = new providers.Web3Provider(getProvider());

};

const web3Transaction = (
  transactionConfig: TransactionConfig,
): Promise<TransactionReceipt> | undefined => {
  return new Promise<TransactionReceipt>((resolve, rejects) => {
    getWeb3()
      ?.eth.sendTransaction(transactionConfig, (error: Error, hash: string) => {
        rejects({error, hash});
      })
      .then((v) => {
        resolve(v);
      })
      .catch((e) => rejects(e));
  });
};

const getWeb3Wrapper = () => {
  const provider = getProvider();
  if (!provider) {
    return null;
  }
  const web3Wrapper = new Web3Wrapper(provider);
  return web3Wrapper;
};

const getBalance = (account: string) => {
  return getWeb3()?.eth.getBalance(account);
};

const getBalanceWithProvider = (account: string, pr: any) => {
 return new Web3(provider).eth.getBalance(account);
};

export {
  connectWeb3,
  getWeb3,
  setWeb3,
  setEthers,
  closeWeb3,
  getProvider,
  setProvider,
  getWeb3Wrapper,
  web3Modal,
  web3Transaction,
  getEthers,
  getBalance,
  getBalanceWithProvider,
};
