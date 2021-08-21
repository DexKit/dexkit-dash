import {EthereumNetwork} from 'shared/constants/AppEnums';

export const getCurrency = (network: EthereumNetwork, address?: string) => {
  if (!address) {
    return;
  }

  switch (network) {
    case EthereumNetwork.ethereum:
      return address.toLowerCase() === 'eth' ? 'ETH' : address;
    case EthereumNetwork.bsc:
      return address.toLowerCase() === 'bnb' ? 'BNB' : address;
    default:
      return address;
  }
};
