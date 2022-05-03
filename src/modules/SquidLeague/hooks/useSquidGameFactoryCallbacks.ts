import { useWeb3 } from 'hooks/useWeb3';
import { useCallback } from 'react';
import { ChainId, Web3State } from 'types/blockchain';
import { SQUID_LEAGUE_FACTORY_ADDRESS } from '../constants';
import { createSquid } from '../services/squidGameFactory';
import { CreateSquidGameParams } from '../utils/types';

interface CallbackProps {
  onSubmit?: any;
  onConfirmation?: any;
  onError?: any;
}

export const useSquidGameFactoryCallbacks = () => {
  const { web3State, getProvider, chainId } = useWeb3();

  const onCreateSquidCallback = useCallback(
    async (params: CreateSquidGameParams, callbacks?: CallbackProps) => {
      if (web3State !== Web3State.Done || !chainId) {
        return;
      }
      const provider = getProvider();
      try {
        const gameAddress = SQUID_LEAGUE_FACTORY_ADDRESS[chainId as ChainId.Mumbai];


        const tx = await createSquid(gameAddress, params, provider);

        callbacks?.onSubmit(tx.hash);
        await tx.wait();
        callbacks?.onConfirmation(tx.hash);
      } catch (e) {
        callbacks?.onError(e);
      }
    },
    [web3State, chainId, getProvider],
  );

  return {
    onCreateSquidCallback,
  };
};
