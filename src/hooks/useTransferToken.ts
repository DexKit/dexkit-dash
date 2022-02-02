import {useCallback} from 'react';
import {transferFrom} from 'services/nfts';
import {useWeb3} from './useWeb3';

export function useTransferToken() {
  const {getProvider} = useWeb3();

  const transfer = useCallback(
    (
      contractAddress: string,
      fromAddress: string,
      toAddress: string,
      tokenId: string,
    ) => {
      transferFrom(
        contractAddress,
        fromAddress,
        toAddress,
        tokenId,
        getProvider(),
      );
    },
    [getProvider],
  );

  return {transfer};
}
