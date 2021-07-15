import {useWeb3} from 'hooks/useWeb3';
import React, {useCallback} from 'react';
import {getOpenSeaPort} from 'utils/opensea';

export function useTokens() {
  const {getProvider} = useWeb3();

  const getTokens = useCallback(async () => {
    const provider = getProvider();
    const openSeaPort = await getOpenSeaPort(provider);

    return openSeaPort.api.getPaymentTokens();
  }, [getProvider]);

  return {getTokens};
}
