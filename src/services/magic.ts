import {OAuthExtension} from '@magic-ext/oauth';
import {Magic} from 'magic-sdk';
import {EthereumNetwork} from 'shared/constants/AppEnums';

const storageKeyNamespace = 'DexKitWallet:';
const cachedNetworkMagicKey = `${storageKeyNamespace}:magic-network`;

const rpcUrls = {
  [EthereumNetwork.bsc]: {
    rpcUrl: 'https://bsc-dataseed.binance.org',
    chainId: 56,
  },
  [EthereumNetwork.matic]: {
    rpcUrl: 'https://rpc-mainnet.matic.network',
    chainId: 137,
  },
};
// @DEV SEE https://magic.link/posts/magic-polygon
const magicBSC = new Magic(process.env.REACT_APP_MAGIC_LINK_API_KEY || '', {
  extensions: [new OAuthExtension()],
  network: rpcUrls[EthereumNetwork.bsc],
});

const magicMatic = new Magic(process.env.REACT_APP_MAGIC_LINK_API_KEY || '', {
  extensions: [new OAuthExtension()],
  network: rpcUrls[EthereumNetwork.matic],
});

const magicETH = new Magic(process.env.REACT_APP_MAGIC_LINK_API_KEY || '', {
  extensions: [new OAuthExtension()],
});

export const getMagicProvider = (networkName: EthereumNetwork) => {
  if (networkName === EthereumNetwork.bsc) {
    return magicBSC.rpcProvider;
  }

  if (networkName === EthereumNetwork.matic) {
    return magicMatic.rpcProvider;
  }

  return magicETH.rpcProvider;
};

/*export const magic = new Magic(process.env.REACT_APP_MAGIC_LINK_API_KEY || '', {
    extensions: [new OAuthExtension()],
  });*/

let magic: any;

export const getMagic = (networkName: EthereumNetwork) => {
  let network;
  if (
    networkName === EthereumNetwork.matic ||
    networkName === EthereumNetwork.bsc
  ) {
    network = rpcUrls[networkName as 'bsc'];
  }
  const oldNetwork = getCachedMagicNetwork();

  if (!magic || oldNetwork !== networkName) {
    magic = new Magic(process.env.REACT_APP_MAGIC_LINK_API_KEY || '', {
      extensions: [new OAuthExtension()],
      network,
    });
    setCachedMagicNetwork(networkName);
  }
  return magic;
};

export const getCachedMagicNetwork = () => {
  return (
    (localStorage.getItem(cachedNetworkMagicKey) as EthereumNetwork) ||
    EthereumNetwork.ethereum
  );
};

export const setCachedMagicNetwork = (network: EthereumNetwork) => {
  localStorage.setItem(cachedNetworkMagicKey, network);
};
