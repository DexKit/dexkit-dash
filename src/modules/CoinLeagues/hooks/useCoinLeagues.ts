import { useNetworkProvider } from 'hooks/provider/useNetworkProvider';
import {useWeb3} from 'hooks/useWeb3';
import {useCallback, useEffect, useState} from 'react';
import {useQuery} from 'react-query';
import { EthereumNetwork } from 'shared/constants/AppEnums';

import {ChainId, Web3State} from 'types/blockchain';
import {
  joinGame,
  startGame,
  endGame,
  withdrawGame,
  abortGame,
  getWinner,
  claim,
  getGamesData,
  getCoinFeeds,
  getCurrentCoinFeedsPrice,
} from '../services/coinLeagues';
import { GET_LEAGUES_CHAIN_ID } from '../utils/constants';

interface CallbackProps {
  onSubmit?: any;
  onConfirmation?: any;
  onError?: any;
}

/**
 * return all data related to game
 * @param address
 * @returns
 */
export const useCoinLeagues = (address?: string) => {
  const [winner, setWinner] = useState<any>();
  const {web3State, account, chainId} = useWeb3();
  const provider = useNetworkProvider(EthereumNetwork.matic, GET_LEAGUES_CHAIN_ID(chainId) );
  useEffect(() => {
    if (!address || !account) {
      return;
    }
    getWinner(address, account).then((w) => {
      setWinner({
        place: w.place,
        address: w.winner_address,
        score: w.score,
        claimed: w.claimed,
      });
    });
  }, [address, account]);

  const onJoinGameCallback = useCallback(
    async (feeds: string[], amount: string, captainCoin: string, callbacks?: CallbackProps) => {
      if (web3State !== Web3State.Done || !address) {
        return;
      }
      try {
        const tx = await joinGame(address, feeds, amount, captainCoin);
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

  const onStartGameCallback = useCallback(
    async (callbacks?: CallbackProps) => {
      if (web3State !== Web3State.Done || !address) {
        return;
      }
      try {
        const tx = await startGame(address);
        callbacks?.onSubmit(tx.hash);
        await tx.wait();
        callbacks?.onConfirmation(tx.hash);
      } catch (e) {
        callbacks?.onError(e);
      }
    },
    [web3State, address],
  );

  const onEndGameCallback = useCallback(
    async (callbacks?: CallbackProps) => {
      if (web3State !== Web3State.Done || !address) {
        return;
      }
      try {
        const tx = await endGame(address);
        callbacks?.onSubmit(tx.hash);
        await tx.wait();
        callbacks?.onConfirmation(tx.hash);
      } catch (e) {
        callbacks?.onError(e);
      }
    },
    [web3State, address],
  );

  const onClaimCallback = useCallback(
    async (callbacks?: CallbackProps) => {
      if (web3State !== Web3State.Done || !address) {
        return;
      }
      try {
        const tx = await claim(address);
        await tx.wait();
        callbacks?.onSubmit(tx.hash);
        await tx.wait();
        callbacks?.onConfirmation(tx.hash);
      } catch (e) {
        callbacks?.onError(e);
      }
    },
    [web3State, address],
  );

  const onWithdrawCallback = useCallback(
    async (callbacks?: CallbackProps) => {
      if (web3State !== Web3State.Done || !address) {
        return;
      }
      try {
        const tx = await withdrawGame(address);
        await tx.wait();
        callbacks?.onSubmit(tx.hash);
        await tx.wait();
        callbacks?.onConfirmation(tx.hash);
      } catch (e) {
        callbacks?.onError(e);
      }
    },
    [web3State, address],
  );

  const onAbortGameCallback = useCallback(
    async (callbacks?: CallbackProps) => {
      if (web3State !== Web3State.Done || !address) {
        return;
      }
      try {
        const tx = await abortGame(address);
        const result = await tx.wait();
        callbacks?.onSubmit(tx.hash);
        await tx.wait();
        callbacks?.onConfirmation(tx.hash);
      } catch (e) {
        callbacks?.onError(e);
      }
    },
    [web3State, address],
  );

  const gameQuery = useQuery(['GetGameAdddress',  address], () => {
    if ( !address || !provider) {
      return;
    }
    return getGamesData([address], provider);
  });
  const coinFeedQuery = useQuery(
    ['GetCoinsFeed',  address, gameQuery.data],
    () => {
      if (
        !address ||
        !gameQuery.data ||
        !gameQuery.data[0] ||
        !provider
      ) {
        return;
      }
      // TODO: Error on query is returning data without being on object
      const feeds = gameQuery.data[0].players.map((p: any) => p[0] as string[]);
      const captainCoins = gameQuery.data[0].players.map((p: any) => p[2] as string);
      const flatFeeds = feeds.flat(1).concat(captainCoins);
      const uniqueFeeds = [...new Set(flatFeeds)];
      if(uniqueFeeds.length){
        return getCoinFeeds(uniqueFeeds, address, provider);
      }  
    },
  );

  const currentFeedPriceQuery = useQuery(
    ['GetCurrentFeedQuery', address, coinFeedQuery.data],
    () => {
      if (  !address || !coinFeedQuery.data || !provider) {
        return;
      }
      // TODO: Error on query is returning data without being on object
      const feeds = coinFeedQuery.data.map((a) => a.address);
      if(feeds.length){
        return getCurrentCoinFeedsPrice(feeds, address, provider);
      }  
    },
  );

  return {
    onJoinGameCallback,
    onStartGameCallback,
    onEndGameCallback,
    onClaimCallback,
    onWithdrawCallback,
    onAbortGameCallback,
    winner,
    game: gameQuery.data && gameQuery.data[0],
    refetch: gameQuery.refetch,
    refetchCurrentFeeds: currentFeedPriceQuery.refetch,
    gameQuery,
    coinFeedQuery,
    allFeeds: coinFeedQuery.data && coinFeedQuery.data,
    currentPrices: currentFeedPriceQuery.data && currentFeedPriceQuery.data,
    loadingFeeds: coinFeedQuery.isLoading,
    currentFeedPriceQuery,
    loadingCurrentFeeds: currentFeedPriceQuery.isLoading,
  };
};
