import {EthereumNetwork} from 'shared/constants/AppEnums';
import {ChainId} from 'types/blockchain';

import {ethers} from 'ethers';

export enum NetworkCodes {
  Ethereum = 1,
  Ropsten = 3,
  Rinkeby = 4,
  Goerli = 5,
  Kovan = 42,
  SmartChain = 56,
  SmartChainTestnet = 97,
  Matic = 137,
  MaticTestnet = 80001,
}

export function getTransactionScannerUrl(
  chainId: number,
  transactionHash: string,
) {
  switch (chainId) {
    case NetworkCodes.Ethereum:
      return `https://etherscan.io/tx/${transactionHash}`;

    case NetworkCodes.Goerli:
      return `https://goerli.etherscan.io/tx/${transactionHash}`;

    case NetworkCodes.Kovan:
      return `https://kovan.etherscan.io/tx/${transactionHash}`;

    case NetworkCodes.Ropsten:
      return `https://ropsten.etherscan.io/tx/${transactionHash}`;

    case NetworkCodes.SmartChain:
      return `https://bscscan.com/tx/${transactionHash}`;

    case NetworkCodes.SmartChainTestnet:
      return `https://testnet.bscscan.com/tx/${transactionHash}`;

    case NetworkCodes.Matic:
      return `https://polygonscan.com/tx/${transactionHash}`;

    case NetworkCodes.MaticTestnet:
      return `https://mumbai.polygonscan.com/tx/${transactionHash}`;

    case NetworkCodes.Rinkeby:
      return `https://rinkeby.etherscan.io/tx/${transactionHash}`;
    default:
      return '';
  }
}

export function getTransactionScannerBaseUrl(chainId: number) {
  switch (chainId) {
    case NetworkCodes.Ethereum:
      return `https://etherscan.io`;

    case NetworkCodes.Goerli:
      return `https://goerli.etherscan.io`;

    case NetworkCodes.Kovan:
      return `https://kovan.etherscan.io`;

    case NetworkCodes.Ropsten:
      return `https://ropsten.etherscan.io`;

    case NetworkCodes.SmartChain:
      return `https://bscscan.com`;

    case NetworkCodes.SmartChainTestnet:
      return `https://testnet.bscscan.com`;

    case NetworkCodes.Matic:
      return `https://polygonscan.com`;

    case NetworkCodes.MaticTestnet:
      return `https://mumbai.polygonscan.com`;

    case NetworkCodes.Rinkeby:
      return `https://rinkeby.etherscan.io`;
    default:
      return '';
  }
}

export function getTransactionScannerUrlV2(
  chainId: number,
  transactionHash: string,
  networks: {chainId: number; explorerUrl: string}[],
) {
  const url = getTransactionScannerBaseUrl(chainId);

  if (url === '') {
    const index = networks.findIndex((n) => n.chainId === chainId);

    if (index > -1) {
      return `${networks[index].explorerUrl}/tx/${transactionHash}`;
    }
  }

  return `${url}/tx/${transactionHash}`;
}

export function getScannerUrl(chainId: number) {
  switch (chainId) {
    case NetworkCodes.Ethereum:
      return `https://etherscan.io`;

    case NetworkCodes.Goerli:
      return `https://goerli.etherscan.io`;

    case NetworkCodes.Kovan:
      return `https://kovan.etherscan.io`;

    case NetworkCodes.Ropsten:
      return `https://ropsten.etherscan.io`;

    case NetworkCodes.SmartChain:
      return `https://bscscan.com/`;

    case NetworkCodes.SmartChainTestnet:
      return `https://testnet.bscscan.com`;

    case NetworkCodes.Matic:
      return `https://polygonscan.com`;

    case NetworkCodes.MaticTestnet:
      return `https://mumbai.polygonscan.com`;

    case NetworkCodes.Rinkeby:
      return `https://rinkeby.etherscan.io`;
    default:
      return '';
  }
}

export function getScannerUrlV2(
  chainId: number,
  networks: {chainId: number; explorerUrl: string}[],
) {
  const explorerUrl = getScannerUrl(chainId);

  if (explorerUrl === '') {
    const index = networks.findIndex((n) => n.chainId === chainId);

    if (index > -1) {
      return networks[index].explorerUrl;
    }
  }

  return explorerUrl;
}

export function getNetworkChainId(networkName: EthereumNetwork) {
  switch (networkName) {
    case EthereumNetwork.bsc:
      return ChainId.Binance;
    case EthereumNetwork.bsc_testnet:
      return ChainId.BinanceTest;
    case EthereumNetwork.ethereum:
      return ChainId.Mainnet;
    case EthereumNetwork.matic:
      return ChainId.Matic;
    default:
      return ChainId.Mainnet;
  }
}

export async function isTransactionMined(
  provider: any,
  transactionHash: string,
) {
  if (provider) {
    const pr = new ethers.providers.Web3Provider(provider);

    const txReceipt = await pr.getTransactionReceipt(transactionHash);

    if (txReceipt && txReceipt.blockNumber) {
      return txReceipt;
    }
  }

  return null;
}

export function hasLondonHardForkSupport(chainId: number) {
  switch (chainId) {
    case ChainId.Rinkeby:
    case ChainId.Ropsten:
    case ChainId.Mainnet:
    case ChainId.Goerli:
    case ChainId.Kovan:
    case ChainId.Matic:
    case ChainId.Mumbai:
      return true;

    default:
      return false;
  }
}

export function isAddressEqual(address: string, another: string) {
  return address.toLowerCase() === another.toLowerCase();
}
