import { BigNumber } from 'ethers';
import { useWeb3 } from 'hooks/useWeb3';
import { useCallback } from 'react';
import { Web3State } from 'types/blockchain';
import {
  withdraw,
  playChallenge,
  finishChallenge,
  joinGame,
  startChallenge,
} from '../services/squidGame';

interface CallbackProps {
  onSubmit?: any;
  onConfirmation?: any;
  onError?: any;
}

export const useSquidGameCallbacks = (gameAddress: string) => {
  const { web3State, getProvider } = useWeb3();

  const onJoinGameCallback = useCallback(
    async (entry: BigNumber, callbacks?: CallbackProps) => {
      if (web3State !== Web3State.Done) {
        return;
      }
      const provider = getProvider();
      try {
        const tx = await joinGame(gameAddress, entry, provider);

        callbacks?.onSubmit(tx.hash);
        await tx.wait();
        callbacks?.onConfirmation(tx.hash);
      } catch (e) {
        callbacks?.onError(e);
      }
    },
    [web3State, gameAddress, getProvider],
  );

  const onPlayChallengeCallback = useCallback(
    async (play: boolean, callbacks?: CallbackProps) => {
      if (web3State !== Web3State.Done) {
        return;
      }
      const provider = getProvider();
      try {
        const tx = await playChallenge(gameAddress, play, provider);

        callbacks?.onSubmit(tx.hash);
        await tx.wait();
        callbacks?.onConfirmation(tx.hash);
      } catch (e) {
        callbacks?.onError(e);
      }
    },
    [web3State, gameAddress, getProvider],
  );

  const onWithdrawCallback = useCallback(
    async (id: number, callbacks?: CallbackProps) => {
      if (web3State !== Web3State.Done) {
        return;
      }
      const provider = getProvider();
      try {
        const tx = await withdraw(gameAddress, provider);
        await tx.wait();
        callbacks?.onSubmit(tx.hash);
        await tx.wait();
        callbacks?.onConfirmation(tx.hash);
      } catch (e) {
        callbacks?.onError(e);
      }
    },
    [web3State, gameAddress, getProvider],
  );
  const onStartChallengeCallback = useCallback(
    async (id: number, callbacks?: CallbackProps) => {
      if (web3State !== Web3State.Done) {
        return;
      }
      const provider = getProvider();
      try {
        const tx = await startChallenge(gameAddress, provider);
        await tx.wait();
        callbacks?.onSubmit(tx.hash);
        await tx.wait();
        callbacks?.onConfirmation(tx.hash);
      } catch (e) {
        callbacks?.onError(e);
      }
    },
    [web3State, gameAddress, getProvider],
  );

  const onFinishChallengeCallback = useCallback(
    async (id: number, callbacks?: CallbackProps) => {
      if (web3State !== Web3State.Done) {
        return;
      }
      const provider = getProvider();
      try {
        const tx = await finishChallenge(gameAddress, provider);
        await tx.wait();
        callbacks?.onSubmit(tx.hash);
        await tx.wait();
        callbacks?.onConfirmation(tx.hash);
      } catch (e) {
        callbacks?.onError(e);
      }
    },
    [web3State, gameAddress, getProvider],
  );

  return {
    onJoinGameCallback,
    onWithdrawCallback,
    onPlayChallengeCallback,
    onFinishChallengeCallback,
    onStartChallengeCallback,
  };
};
