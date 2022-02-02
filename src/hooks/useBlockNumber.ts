import {ethers} from 'ethers';
import React, {useEffect, useState} from 'react';
import {Web3State} from 'types/blockchain';
import {useWeb3} from './useWeb3';

export function useBlockNumber() {
  const [blockNumber, setBlockNumer] = useState(0);

  const {getProvider, web3State} = useWeb3();

  useEffect(() => {
    const pr = getProvider();

    if (web3State === Web3State.Done && pr) {
      debugger;

      const provider = new ethers.providers.Web3Provider(pr);

      provider.on('block', (block: number) => {
        setBlockNumer(block);
      });
    }
  }, [web3State, getProvider]);

  return {blockNumber: blockNumber || 0};
}
