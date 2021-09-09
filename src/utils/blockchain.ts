import {EthereumNetwork} from 'shared/constants/AppEnums';

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
      return NetworkCodes.SmartChain;
    case EthereumNetwork.bsc_testnet:
      return NetworkCodes.SmartChainTestnet;
    case EthereumNetwork.ethereum:
      return NetworkCodes.Ethereum;
    case EthereumNetwork.matic:
      return NetworkCodes.Matic;
    default:
      return 0;
  }
}
