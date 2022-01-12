import {useState, useEffect} from 'react';
import {
  GET_CHAIN_ID_NAME_V2,
  GET_CHAIN_NATIVE_COIN_V2,
} from 'shared/constants/Blockchain';
import {useWeb3} from './useWeb3';

import {useCustomNetworkList} from 'hooks/network';

export function useChainInfo() {
  const [chainName, setChainName] = useState<string>();
  const [tokenSymbol, setTokenSymbol] = useState<string>();

  const {chainId} = useWeb3();

  const {networks} = useCustomNetworkList();

  useEffect(() => {
    if (chainId) {
      const networkName = GET_CHAIN_ID_NAME_V2(
        chainId,
        networks.map((n) => ({name: n.name, chainId: n.chainId})),
      );
      setChainName(networkName);

      const symbol = GET_CHAIN_NATIVE_COIN_V2(
        chainId,
        networks.map((n) => ({
          chainId: n.chainId,
          symbol: n.nativeTokenSymbol,
        })),
      );

      setTokenSymbol(symbol);
    }
  }, [chainId, networks]);

  return {
    chainName,
    tokenSymbol,
  };
}
