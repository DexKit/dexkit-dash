import {useState, useEffect, useCallback} from 'react';
import {
  GET_CHAIN_ID_NAME_V2,
  GET_CHAIN_NATIVE_COIN_V2,
} from 'shared/constants/Blockchain';
import {useWeb3} from './useWeb3';

import {useCustomNetworkList} from 'hooks/network';
import {getScannerUrlV2, getTransactionScannerUrlV2} from 'utils/blockchain';

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
    chainName,
    tokenSymbol,
    getScannerUrl,
    getTransactionScannerUrl,
  };
}
