import {OAuthExtension} from '@magic-ext/oauth';
import {Magic} from 'magic-sdk';
import {EthereumNetwork} from 'shared/constants/AppEnums';

const storageKeyNamespace = 'DexKitWallet:';
const cachedNetworkMagicKey = `${storageKeyNamespace}:magic-network`;
const providerMagicKey = `${storageKeyNamespace}:magic-provider`;
export const magicStorage = `${storageKeyNamespace}:is-magic`;

export const enum MagicAuthProviders {
  email = 'email',
  google = 'google',
  twitter = 'twitter',
  discord = 'discord',
}

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

export const getMagicRPCProvider = (networkName: EthereumNetwork) => {
  if (networkName === EthereumNetwork.bsc) {
    return magicBSC.rpcProvider;
  }

  if (networkName === EthereumNetwork.matic) {
    return magicMatic.rpcProvider;
  }

  return magicETH.rpcProvider;
};

export const getMagicProvider = async () => {
  const network = getCachedMagicNetwork();
  const magic = getMagic(network);
  await magic.preload();
  const isLogged = await magic.user.isLoggedIn();
  if (isLogged) {
    return magic.rpcProvider;
  }
  throw new Error('Magic not logged');
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

type supportedMagicProviders =
  | 'email'
  | 'google'
  | 'twitter'
  | 'discord'
  | 'apple';

export const setAuthMagicProvider = (provider: supportedMagicProviders) => {
  localStorage.setItem(providerMagicKey, provider);
};

export const getAuthMagicProvider = () => {
  return (
    (localStorage.getItem(providerMagicKey) as supportedMagicProviders) ||
    'email'
  );
};

export const isMagicProvider = () => {
  return localStorage.getItem(magicStorage) === 'true';
};

export const setIsMagicProvider = (status: 'false' | 'true') => {
  localStorage.setItem(magicStorage, status);
};
