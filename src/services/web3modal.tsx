import Web3 from 'web3';
import {
  TransactionConfig,
  TransactionReceipt,
  // PromiEvent
} from 'web3-core';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import {Magic} from 'magic-sdk';
import {Web3Wrapper} from '@0x/web3-wrapper';
import {ethers, providers} from 'ethers';
import { getCachedMagicNetwork, getMagic } from './magic';

const storageKeyNamespace = 'DexKitWallet:';
const magicGoogleStorage = `${storageKeyNamespace}:magic-google`;
const magicGoogleId = 'custom-magiclink-google';

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: process.env.REACT_APP_INFURA_ID,
    },
  },
  [`${magicGoogleId}`]: {
    display: {
      logo: 'data:image/gif;base64,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',
      name: 'Google',
      description: 'Connect With Google',
    },
    package: Magic,
    options: {
      apiKey: process.env.REACT_APP_MAGIC_LINK_API_KEY,
    },
    connector: async (ProviderPackage: Magic, options: any) => {
      const network =  getCachedMagicNetwork();
      const magic = getMagic(network)

      await magic.preload()
      let isLogged;
      const tryLogin =  localStorage.getItem(magicGoogleStorage);
      try {
        isLogged = await magic.user.isLoggedIn(); 
        if (isLogged) {
          return magic.rpcProvider;
        }
      } catch (e) {
        
      }
      try {  
        if(tryLogin === 'false'){
          localStorage.setItem(magicGoogleStorage, 'true');
          await magic.oauth.loginWithRedirect({
           provider: 'google' /* 'google', 'facebook', 'apple', or 'github' */,
           // TODO: When production use main site
           redirectURI: 'http://localhost:3000/magic/callback-social',
          }); 

          return magic.rpcProvider;
         }
      
      } catch (e) {
        localStorage.setItem(magicGoogleStorage, 'false');
      }
    
      return magic.rpcProvider;
    },
  },
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
  const isMagic = localStorage.getItem(magicGoogleStorage);
  if (isMagic === 'true') {
    provider = await web3Modal.connectTo(magicGoogleId);
  } else {
    provider = await web3Modal.connect();
  }

  provider = await web3Modal.connect();
  return provider;
};

const closeWeb3 = async () => {
  provider = null;
  web3 = null;
  const  storageMagic = localStorage.getItem(magicGoogleStorage);
  if(storageMagic === 'true'){
    const network =  getCachedMagicNetwork();
    const magic = getMagic(network)
    await magic.user.logout();
    localStorage.setItem(magicGoogleStorage, 'false');
  }

  web3Modal.clearCachedProvider();
};

const getProvider = (): any | undefined => {
  if (!provider) {
    return;
  }
  return provider;
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

let ethersjs: null | ethers.providers.Web3Provider;
const getEthers = () => {
  if (!provider) {
    return;
  }
  if (!ethersjs) {
    ethersjs = new providers.Web3Provider(getProvider());
  }
  return ethersjs;
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
  closeWeb3,
  getProvider,
  getWeb3Wrapper,
  web3Modal,
  web3Transaction,
  getEthers,
  getBalance,
  getBalanceWithProvider,
};
