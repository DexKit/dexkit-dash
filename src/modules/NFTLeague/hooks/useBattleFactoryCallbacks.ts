import {BigNumber, ContractReceipt, ethers} from 'ethers';
import {useWeb3} from 'hooks/useWeb3';
import {useCallback} from 'react';
import {Web3State} from 'types/blockchain';

import battleFactoryAbi from '../constants/ABI/BattleNFTFactory.json';
import {
  claim,
  createAndJoinGame,
  endGame,
  joinGame,
  startGame,
} from '../services/battleFactory';

interface CallbackProps {
  onSubmit?: any;
  onConfirmation?: any;
  onError?: any;
}

export const useBattleFactoryCallbacks = (gameAddress: string) => {
  const {web3State, getProvider} = useWeb3();

  const onJoinGameCallback = useCallback(
    async (
      id: number,
      championId: number,
      bittFeed: number,
      multiplier: number,
      entry: BigNumber,
      callbacks?: CallbackProps,
    ) => {
      if (web3State !== Web3State.Done) {
        return;
      }

      const provider = getProvider();
      try {
        const tx = await joinGame(
          gameAddress,
          {
            id,
            championId,
            bittFeed,
            multiplier,
            entry,
          },
          provider,
        );

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

  const onCreateAndJoinGameCallback = useCallback(
    async (
      championId: number,
      bittFeed: number,
      multiplier: number,
      type: number,
      duration: number,
      startTimestamp: number,
      entry: BigNumber,
      callbacks?: CallbackProps,
    ) => {
      if (web3State !== Web3State.Done) {
        return;
      }
      const provider = getProvider();

      try {
        const tx = await createAndJoinGame(
          gameAddress,
          {
            championId,
            bittFeed,
            multiplier,
            startTimestamp,
            duration,
            entry,
            type,
          },
          provider,
        );

        callbacks?.onSubmit(tx.hash);

        const receipt = await tx.wait();

        const iface = new ethers.utils.Interface(battleFactoryAbi);

        const event = iface.decodeEventLog(
          'CreatedGame',
          receipt.logs[1].data,
          receipt.logs[1].topics,
        );

        callbacks?.onConfirmation(event['id']);
      } catch (e) {
        console.log(e);
        callbacks?.onError(e);
      }
    },
    [web3State, gameAddress],
  );

  const onClaimCallback = useCallback(
    async (id: number, callbacks?: CallbackProps) => {
      if (web3State !== Web3State.Done) {
        return;
      }
      const provider = getProvider();
      try {
        const tx = await claim(gameAddress, id, provider);
        await tx.wait();
        callbacks?.onSubmit(tx.hash);
        await tx.wait();
        callbacks?.onConfirmation(tx.hash);
      } catch (e) {
        callbacks?.onError(e);
      }
    },
    [web3State, gameAddress],
  );
  const onStartGameCallback = useCallback(
    async (id: number, callbacks?: CallbackProps) => {
      if (web3State !== Web3State.Done) {
        return;
      }
      const provider = getProvider();
      try {
        const tx = await startGame(gameAddress, id, provider);
        await tx.wait();
        callbacks?.onSubmit(tx.hash);
        await tx.wait();
        callbacks?.onConfirmation(tx.hash);
      } catch (e) {
        callbacks?.onError(e);
      }
    },
    [web3State],
  );

  const onEndGameCallback = useCallback(
    async (id: number, callbacks?: CallbackProps) => {
      if (web3State !== Web3State.Done) {
        return;
      }
      const provider = getProvider();
      try {
        const tx = await endGame(gameAddress, id, provider);
        await tx.wait();
        callbacks?.onSubmit(tx.hash);
        await tx.wait();
        callbacks?.onConfirmation(tx.hash);
      } catch (e) {
        callbacks?.onError(e);
      }
    },
    [web3State],
  );

  return {
    onJoinGameCallback,
    onClaimCallback,
    onCreateAndJoinGameCallback,
    onEndGameCallback,
    onStartGameCallback,
  };
};
