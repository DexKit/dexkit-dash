import {BigNumber} from 'ethers';
import {useWeb3} from 'hooks/useWeb3';
import {useCallback} from 'react';
import {Web3State} from 'types/blockchain';
import {createSquid} from '../services/squidGameFactory';
import {CreateSquidGameParams} from '../utils/types';

interface CallbackProps {
  onSubmit?: any;
  onConfirmation?: any;
  onError?: any;
}

export const useSquidGameFactoryCallbacks = (gameAddress: string) => {
  const {web3State, getProvider} = useWeb3();

  const onCreateSquidCallback = useCallback(
    async (params: CreateSquidGameParams, callbacks?: CallbackProps) => {
      if (web3State !== Web3State.Done) {
        return;
      }
      const provider = getProvider();
      try {
        const tx = await createSquid(gameAddress, params, provider);

        callbacks?.onSubmit(tx.hash);
        await tx.wait();
        callbacks?.onConfirmation(tx.hash);
      } catch (e) {
        console.log(e);
        callbacks?.onError(e);
      }
    },
    [web3State],
  );

  return {
    onCreateSquidCallback,
  };
};
