import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: process.env.REACT_APP_INFURA_ID,
    }
  }
};

const web3Modal = new Web3Modal({
  network: 'mainnet', // optional
  cacheProvider: true, // optional
  providerOptions // required
});
let web3: null | Web3;
let provider: any;



const connectWeb3 = async () => {
    provider = await web3Modal.connect();
    return provider;
}

const closeWeb3 = () => {
  provider = null;
  web3 = null;
  web3Modal.clearCachedProvider();
}

const getProvider = () => {
  if(!provider){
    return;
  }
  return provider;

}

const getWeb3 = () => { 
    if(!provider){
        return;
    }
    if(!web3){
        web3 = new Web3(provider);
        return web3;
    }
    return web3;
}

export {connectWeb3, getWeb3, closeWeb3, getProvider, web3Modal}

