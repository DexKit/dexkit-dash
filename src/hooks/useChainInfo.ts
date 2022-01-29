import {useState, useEffect, useCallback, useMemo} from 'react';
import {
  GET_CHAIN_ID_NAME_V2,
  GET_CHAIN_NATIVE_COIN_V2,
} from 'shared/constants/Blockchain';
import {useWeb3} from './useWeb3';

import {useCustomNetworkList} from 'hooks/network';
import {getScannerUrlV2, getTransactionScannerUrlV2} from 'utils/blockchain';
import {GET_NETWORK_NAME_V2} from 'shared/constants/Bitquery';
import {EthereumNetwork} from 'shared/constants/AppEnums';

export function useChainInfo() {
  const [chainName, setChainName] = useState<string>();
  const [network, setNetwork] = useState<EthereumNetwork>();
  const [tokenSymbol, setTokenSymbol] = useState<string>();

  const {chainId} = useWeb3();

  const {networks} = useCustomNetworkList();

  const isCustomNetwork = useMemo(() => {
    const net = networks.find((n) => n.name === network);
    if (net) {
      return true;
    }
    return false;
  }, [network, networks]);

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
      // We use this because some functions need the exact network from bitquery
      setNetwork(GET_NETWORK_NAME_V2(networkName, chainId) as EthereumNetwork);
    }
  }, [chainId, networks]);

  const getScannerUrl = useCallback(
    (chainId: number) => {
      return getScannerUrlV2(
        chainId,
        networks.map((n) => ({chainId: n.chainId, explorerUrl: n.explorerUrl})),
      );
    },
    [networks],
  );

  const getTransactionScannerUrl = useCallback(
    (chainId: number, transactionHash: string) => {
      return getTransactionScannerUrlV2(
        chainId,
        transactionHash,
        networks.map((n) => ({chainId: n.chainId, explorerUrl: n.explorerUrl})),
      );
    },
    [networks],
  );

  return {
    network,
    chainName,
    tokenSymbol,
    getScannerUrl,
    getTransactionScannerUrl,
    isCustomNetwork,
  };
}
