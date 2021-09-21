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
    let pr = new ethers.providers.Web3Provider(provider);
    const txReceipt = await pr.getTransactionReceipt(transactionHash);

    if (txReceipt && txReceipt.blockNumber) {
      return txReceipt;
    }
  }

  return null;
}
