import {ethers} from 'ethers';
import React, {useEffect, useState} from 'react';
import {Web3State} from 'types/blockchain';
import {useWeb3} from './useWeb3';

export function useBlockNumber() {
  const [blockNumber, setBlockNumer] = useState(0);

  const {getProvider, web3State} = useWeb3();

  // useEffect(() => {
  //   let interval: any = null;

  //   if (web3State === Web3State.Done) {
  //     let provider = getProvider();

  //     if (provider) {
  //       let pr = new ethers.providers.Web3Provider(provider);

  //       setInterval(async () => {
  //         setBlockNumer(await pr.getBlockNumber());
  //       }, 5000);
  //     }
  //   }
  //   return () => {
  //     if (interval) {
  //       clearInterval(interval);
  //     }
  //   };
  // }, [web3State, getProvider]);

  return {blockNumber: 0};
}
