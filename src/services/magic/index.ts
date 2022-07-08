import { OAuthExtension } from '@magic-ext/oauth';
import { Magic } from 'magic-sdk';

import { NetworkSlugs } from 'shared/constants/AppEnums';
import { AppNetworks } from 'shared/constants/Networks';
import { ChainId } from 'types/blockchain';

const storageKeyNamespace = 'DexKitWallet:';
const cachedNetworkMagicKey = `${storageKeyNamespace}:magic-network`;
const providerMagicKey = `${storageKeyNamespace}:magic-provider`;
export const magicStorage = `${storageKeyNamespace}:is-magic`;

export const enum MagicNetworks {
  ethereum = 'ethereum',
  bsc = 'bsc',
  matic = 'matic',
  mumbai = 'mumbai',
  ropsten = 'ropsten',
  avalanche = 'avalanche',
  fantom = 'fantom',
  okc = 'okc'

}

export const enum MagicAuthProviders {
  email = 'email',
  google = 'google',
  twitter = 'twitter',
  discord = 'discord',
}

const rpcUrls = {
  [MagicNetworks.bsc]: {
    rpcUrl: 'https://bsc-dataseed.binance.org',
    chainId: 56,
  },
  [MagicNetworks.matic]: {
    // rpcUrl: 'https://rpc-mainnet.matic.network',
    rpcUrl: 'https://polygon-rpc.com/',
    chainId: 137,
  },
  [MagicNetworks.okc]: {
    rpcUrl: AppNetworks[NetworkSlugs.okc]?.rpcURL as string,
    chainId: AppNetworks[NetworkSlugs.okc]?.chainId as number,
  },
  [MagicNetworks.fantom]: {
    rpcUrl: AppNetworks[NetworkSlugs.fantom]?.rpcURL as string,
    chainId: AppNetworks[NetworkSlugs.fantom]?.chainId as number,
  },
  [MagicNetworks.avalanche]: {

    rpcUrl: AppNetworks[NetworkSlugs.avalanche]?.rpcURL as string,
    chainId: AppNetworks[NetworkSlugs.avalanche]?.chainId as number,
  },
};
// @DEV SEE https://magic.link/posts/magic-polygon
const magicBSC = new Magic(process.env.REACT_APP_MAGIC_LINK_API_KEY || '', {
  extensions: [new OAuthExtension()],
  network: rpcUrls[MagicNetworks.bsc],
});

const magicMatic = new Magic(process.env.REACT_APP_MAGIC_LINK_API_KEY || '', {
  extensions: [new OAuthExtension()],
  network: rpcUrls[MagicNetworks.matic],
});

const magicETH = new Magic(process.env.REACT_APP_MAGIC_LINK_API_KEY || '', {
  extensions: [new OAuthExtension()],
});

const magicRopsten = new Magic(
  process.env.REACT_APP_MAGIC_TESTNET_LINK_API_KEY ||
  'pk_test_D1D2C225CC7848C6',
  {
    extensions: [new OAuthExtension()],
    network: 'ropsten',
  },
);

const magicMumbai = new Magic(
  process.env.REACT_APP_MAGIC_TESTNET_LINK_API_KEY ||
  'pk_test_D1D2C225CC7848C6',
  {
    extensions: [new OAuthExtension()],
    network: {
      //rpcUrl: 'https://rpc-mainnet.matic.network',
      rpcUrl: 'https://matic-mumbai.chainstacklabs.com',
      chainId: 80001,
    },
  },
);

export const getMagicRPCProvider = (networkName: MagicNetworks) => {
  if (networkName === MagicNetworks.bsc) {
    return magicBSC.rpcProvider;
  }

  if (networkName === MagicNetworks.matic) {
    return magicMatic.rpcProvider;
  }

  if (networkName === MagicNetworks.ropsten) {
    return magicRopsten.rpcProvider;
  }

  if (networkName === MagicNetworks.mumbai) {
    return magicMumbai.rpcProvider;
  }

  if (networkName === MagicNetworks.ethereum) {
    return magicETH.rpcProvider;
  }
  const net = rpcUrls[networkName];
  return new Magic(process.env.REACT_APP_MAGIC_LINK_API_KEY || '', {
    extensions: [new OAuthExtension()],
    network: net
  }).rpcProvider;



};
let magic: any;


export const getMagicProvider = async () => {
  const network = getCachedMagicNetwork();
  const magic = getMagic(network);
  const isLogged = await magic.user.isLoggedIn();
  if (isLogged) {
    return magic.rpcProvider;
  }
  throw new Error('Magic not logged');
};

/*export const magic = new Magic(process.env.REACT_APP_MAGIC_LINK_API_KEY || '', {
    extensions: [new OAuthExtension()],
  });*/

export const getMagic = (networkName: MagicNetworks) => {
  if (networkName === MagicNetworks.ropsten) {
    setCachedMagicNetwork(networkName);
    return magicRopsten;
  }

  if (networkName === MagicNetworks.mumbai) {
    setCachedMagicNetwork(networkName);
    return magicMumbai;
  }
  let network;
  if (
    networkName !== MagicNetworks.ethereum
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

export const isMagicTestnet = (network: MagicNetworks) => {
  return network === MagicNetworks.ropsten || network === MagicNetworks.mumbai;
};

export const getCachedMagicNetwork = () => {
  return (
    (localStorage.getItem(cachedNetworkMagicKey) as MagicNetworks) ||
    MagicNetworks.ethereum
  );
};

export const setCachedMagicNetwork = (network: MagicNetworks) => {
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

export const GET_MAGIC_NETWORK_FROM_CHAIN_ID = (chainId: ChainId) => {
  switch (chainId) {
    case ChainId.Mainnet:
      return MagicNetworks.ethereum;
    case ChainId.Binance:
      return MagicNetworks.bsc;
    case ChainId.Matic:
      return MagicNetworks.matic;
    case ChainId.Ropsten:
      return MagicNetworks.ropsten;
    case ChainId.Mumbai:
      return MagicNetworks.mumbai;
    default:
      const ind = Object.values(rpcUrls).findIndex(n => n.chainId === chainId);
      if (ind > -1) {
        return Object.keys(rpcUrls)[ind] as MagicNetworks;
      }
      return MagicNetworks.ethereum;
  }
};
