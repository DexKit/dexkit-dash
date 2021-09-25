import {useMemo} from 'react';
import {
  bscNetworkProvider,
  ethereumNetworkProvider,
  maticNetworkProvider,
  ethereumRopstenNetworkProvider,
  mumbaiNetworkProvider,
} from 'services/networkProvider';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {ChainId} from 'types/blockchain';

export const useNetworkProvider = (
  networkName: EthereumNetwork,
  chainId?: ChainId,
) => {
  return useMemo(() => {
    if (chainId && chainId === ChainId.Ropsten) {
      return ethereumRopstenNetworkProvider;
    }
    if (chainId && chainId === ChainId.Mumbai) {
      return mumbaiNetworkProvider;
    }

    if (networkName === EthereumNetwork.ethereum) {
      return ethereumNetworkProvider;
    } else if (networkName === EthereumNetwork.bsc) {
      return bscNetworkProvider;
    } else {
      return maticNetworkProvider;
    }
  }, [networkName, chainId]);
};
