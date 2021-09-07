import {Network} from 'types/blockchain';

// TODO: Refactor this to check by type
export const isSupportedWalletType = (network: Network) => {
  if (
    network ===
    (Network.bitcoin ||
      Network.cardano ||
      Network.dogecoin ||
      Network.eos ||
      Network.dash)
  ) {
    return true;
  }
  return false;
};

export function switchChain(provider: any, to: number): Promise<any> {
  return provider.request({
    method: 'wallet_switchEthereumChain',
    params: [{chainId: `0x${to.toString(16)}`}],
  });
}
