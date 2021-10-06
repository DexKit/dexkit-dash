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
  networkName?: EthereumNetwork,
  chainId?: ChainId,
) => {
  return useMemo(() => {
    if (chainId) {
      if (chainId === ChainId.Ropsten) {
        return ethereumRopstenNetworkProvider;
      } else if (chainId === ChainId.Mumbai) {
        return mumbaiNetworkProvider;
      } else if (chainId === ChainId.Mainnet) {
        return ethereumNetworkProvider;
      } else if (chainId === ChainId.Binance) {
        return bscNetworkProvider;
      } else if (chainId === ChainId.Matic) {
        return maticNetworkProvider;
      }
    }

    if (networkName === EthereumNetwork.ethereum) {
      return ethereumNetworkProvider;
    } else if (networkName === EthereumNetwork.bsc) {
      return bscNetworkProvider;
    } else if (networkName === EthereumNetwork.matic) {
      return maticNetworkProvider;
    }
  }, [networkName, chainId]);
};
