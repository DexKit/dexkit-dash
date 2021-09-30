import { useDrops } from "./useDrops"
import {useWeb3} from 'hooks/useWeb3';
import {useCallback} from 'react';

import { Web3State } from 'types/blockchain';
import { BigNumber } from 'ethers';
import { mintNFT } from "../services/droppad";

interface CallbackProps {
    onSubmit?: any;
    onConfirmation?: any;
    onError?: any;
  }

export const useDrop = (address: string) => {
    const drops = useDrops()
    const drop = drops.find(a=> a.address.toLowerCase() === address.toLowerCase());
    const {web3State} = useWeb3();

    const onMintCallback = useCallback(
        async (amount: BigNumber, callbacks?: CallbackProps) => {
          if (web3State !== Web3State.Done || !address) {
            return;
          }
          try {
            const tx = await mintNFT(address, amount.toString());
            callbacks?.onSubmit(tx.hash);
            await tx.wait();
            callbacks?.onConfirmation(tx.hash);
          } catch (e) {
            console.log(e);
            callbacks?.onError(e);
          }
        },
        [web3State, address],
      );


    return {
        drop,
        onMintCallback,
    }

}