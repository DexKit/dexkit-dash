export enum NetworkCodes {
  Ethereum = 1,
  Rinkeby = 4,
}

export function getTransactionScannerUrl(
  chainId: number,
  transactionHash: string,
) {
  switch (chainId) {
    case NetworkCodes.Ethereum:
      return `https://etherscan.io/tx/${transactionHash}`;
    case NetworkCodes.Rinkeby:
      return `https://rinkeby.etherscan.io/tx/${transactionHash}`;
    default:
      return '';
  }
}
