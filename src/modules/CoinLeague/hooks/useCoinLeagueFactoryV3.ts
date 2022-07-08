import { BigNumber } from 'ethers';
import { useNetworkProvider } from 'hooks/provider/useNetworkProvider';
import { useWeb3 } from 'hooks/useWeb3';
import { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import { approveToken } from 'services/token';
import { EthereumNetwork } from 'shared/constants/AppEnums';
import { ZERO_ADDRESS } from 'shared/constants/Blockchain';

import { Web3State } from 'types/blockchain';
import { GameParamsV3 } from 'types/coinleague';
import {
  COIN_LEAGUES_FACTORY_ADDRESS_V3,
} from '../constants';
import {
  claim,
  getCoinFeeds,
  getCurrentCoinFeedsPrice,
  getAmountOnContract,
  getChampionRoom,
  joinGame,
  getWinner,
  getGamesData,
  withdrawGame,
  createGame,
  startGame,
  endGame,
  abortGame,
} from '../services/coinLeagueFactoryV3';
import { getGameAddressFromId } from '../services/coinLeaguesFactory';


import {
  GET_LEAGUES_CHAIN_ID,
  IS_SUPPORTED_LEAGUES_CHAIN_ID,
} from '../utils/constants';

import { useLeaguesChainInfo } from './useLeaguesChainInfo';

interface CallbackProps {
  onSubmit?: any;
  onConfirmation?: any;
  onError?: any;
}

export const useFactoryAddress = () => {
  const { chainId } = useLeaguesChainInfo();


  return useMemo(() => {
    return COIN_LEAGUES_FACTORY_ADDRESS_V3[GET_LEAGUES_CHAIN_ID(chainId)];
  }, [chainId]);
}


/**
 * return all data related to game
 * @param address
 * @returns
 */
export const useCoinLeagueFactory = (id?: string) => {
  const { web3State, account, getProvider } = useWeb3();
  const { chainId } = useLeaguesChainInfo();

  const provider = useNetworkProvider(
    EthereumNetwork.matic,
    GET_LEAGUES_CHAIN_ID(chainId),
  );
  const chainProvider = getProvider();

  const factoryAddress = useFactoryAddress();


  const winnerQuery = useQuery(['GET_WINNER', factoryAddress, account, id], () => {
    if (!factoryAddress || !account || web3State !== Web3State.Done || !id) {
      return;
    }
    return getWinner(factoryAddress, account, chainProvider, id).then((w) => {
      return {
        place: w.place,
        address: w.winner_address,
        score: w.score,
        claimed: w.claimed,
      };
    });
  });

  const onJoinGameCallback = useCallback(
    async (
      feeds: string[],
      amount: string,
      captainCoin: string,
      callbacks?: CallbackProps,
      affiliate = ZERO_ADDRESS,
    ) => {
      if (web3State !== Web3State.Done || !factoryAddress || !id) {
        return;
      }
      try {
        const tx = await joinGame(
          factoryAddress,
          feeds,
          amount,
          captainCoin,
          chainProvider,
          affiliate || ZERO_ADDRESS,
          id,
        );
        callbacks?.onSubmit(tx.hash);
        await tx.wait();
        callbacks?.onConfirmation(tx.hash);
      } catch (e) {
        console.log(e);
        callbacks?.onError(e);
      }
    },
    [web3State, id, chainProvider, factoryAddress],
  );

  const onClaimCallback = useCallback(
    async (winner: string, callbacks?: CallbackProps) => {
      if (web3State !== Web3State.Done || !id || !factoryAddress) {
        return;
      }
      try {
        const tx = await claim(factoryAddress, chainProvider, winner, id);
        await tx.wait();
        callbacks?.onSubmit(tx.hash);
        await tx.wait();
        callbacks?.onConfirmation(tx.hash);
      } catch (e) {
        callbacks?.onError(e);
      }
    },
    [web3State, factoryAddress, id, chainProvider],
  );

  const onWithdrawCallback = useCallback(
    async (callbacks?: CallbackProps) => {
      if (web3State !== Web3State.Done || !factoryAddress || !account || !id) {
        return;
      }
      try {
        const tx = await withdrawGame(factoryAddress, chainProvider, account, id);
        await tx.wait();
        callbacks?.onSubmit(tx.hash);
        await tx.wait();
        callbacks?.onConfirmation(tx.hash);
      } catch (e) {
        callbacks?.onError(e);
      }
    },
    [web3State, factoryAddress, id, chainProvider, account],
  );

  const gameQuery = useQuery(['GetGameAdddress', factoryAddress, id], () => {
    if (!factoryAddress || !provider || !id) {
      return;
    }
    return getGamesData([id], factoryAddress, provider);
  });
  const coinFeedQuery = useQuery(
    ['GetCoinsFeed', factoryAddress, id, gameQuery.data],
    () => {
      if (!factoryAddress || !id || !gameQuery.data || !gameQuery.data[0] || !provider) {
        return;
      }
      // TODO: Error on query is returning data without being on object
      const feeds = gameQuery.data[0].players.map((p: any) => p[0] as string[]);
      const captainCoins = gameQuery.data[0].players.map(
        (p: any) => p[2] as string,
      );
      const flatFeeds = feeds.flat(1).concat(captainCoins);
      const uniqueFeeds = [...new Set(flatFeeds)];
      if (uniqueFeeds.length) {
        return getCoinFeeds(uniqueFeeds, factoryAddress, id, provider);
      }
    },
  );

  const currentFeedPriceQuery = useQuery(
    ['GetCurrentFeedQuery', factoryAddress, coinFeedQuery.data],
    () => {
      if (!factoryAddress || !coinFeedQuery.data || !provider || !id) {
        return;
      }
      // TODO: Error on query is returning data without being on object
      const feeds = coinFeedQuery.data.map((a) => a.address);
      if (feeds.length) {
        return getCurrentCoinFeedsPrice(feeds, factoryAddress, id, provider);
      }
    },
  );

  const amountOnContractQuery = useQuery(
    ['AmountOnContractQuery', factoryAddress, id, gameQuery.data, account],
    () => {
      if (
        !factoryAddress ||
        !account ||
        !gameQuery.data ||
        !gameQuery.data[0]?.aborted || !id
      ) {
        return;
      }
      return getAmountOnContract(factoryAddress, account, provider, id);
    },
  );

  return {
    onJoinGameCallback,
    onClaimCallback,
    onWithdrawCallback,
    amountOnContract: amountOnContractQuery.data && amountOnContractQuery.data,
    winner: winnerQuery.data && winnerQuery.data,
    refetchWinner: winnerQuery.refetch,
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

export const useChampionsRoom = (id?: string, isNFT = false) => {
  const { chainId } = useWeb3();
  const provider = useNetworkProvider(
    EthereumNetwork.matic,
    GET_LEAGUES_CHAIN_ID(chainId),
  );

  const factoryAddress = useFactoryAddress();
  const addressQuery = useQuery(
    ['GET_ADDRESS_GAME', id, factoryAddress],
    () => {
      if (!id || !factoryAddress) {
        return;
      }
      return getGameAddressFromId(factoryAddress, id, provider);
    },
  );

  return useQuery(['GET_CHAMPIONS_ROOM', isNFT, addressQuery.data], () => {
    if (!isNFT || !addressQuery.data || !provider) {
      return;
    }
    return getChampionRoom(addressQuery.data, provider);
  });
};

export const useCoinLeagueV3Callbacks = (id?: string) => {
  const { web3State, chainId, getProvider } = useWeb3();


  const factoryAddress = useFactoryAddress()

  const onJoinGameCallback = useCallback(
    async (
      feeds: string[],
      amount: string,
      captainCoin: string,
      callbacks?: CallbackProps,
      affiliate = ZERO_ADDRESS,
    ) => {
      if (web3State !== Web3State.Done || !factoryAddress || !id) {
        return;
      }
      try {
        const tx = await joinGame(
          factoryAddress,
          feeds,
          amount,
          captainCoin,
          getProvider(),
          affiliate || ZERO_ADDRESS,
          id,
        );
        callbacks?.onSubmit(tx.hash);
        await tx.wait();
        callbacks?.onConfirmation(tx.hash);
      } catch (e) {
        console.log(e);
        callbacks?.onError(e);
      }
    },
    [web3State, factoryAddress, getProvider, id],
  );

  const onStartGameCallback = useCallback(
    async (callbacks?: CallbackProps) => {
      if (
        web3State !== Web3State.Done ||
        !factoryAddress ||
        !chainId ||
        !IS_SUPPORTED_LEAGUES_CHAIN_ID(chainId) ||
        !id
      ) {
        return;
      }
      try {
        const tx = await startGame(factoryAddress, getProvider(), id);
        callbacks?.onSubmit(tx.hash);
        await tx.wait();
        callbacks?.onConfirmation(tx.hash);
      } catch (e) {
        console.log(e);
        callbacks?.onError(e);
      }
    },
    [web3State, factoryAddress, chainId, id, getProvider],
  );

  const onEndGameCallback = useCallback(
    async (callbacks?: CallbackProps) => {
      if (
        web3State !== Web3State.Done ||
        !chainId ||
        !IS_SUPPORTED_LEAGUES_CHAIN_ID(chainId) ||
        !factoryAddress || !id
      ) {
        return;
      }
      try {
        const tx = await endGame(factoryAddress, getProvider(), id);
        callbacks?.onSubmit(tx.hash);
        await tx.wait();
        callbacks?.onConfirmation(tx.hash);
      } catch (e) {
        callbacks?.onError(e);
      }
    },
    [web3State, id, chainId, factoryAddress, getProvider],
  );

  const onApproveTokenCallback = useCallback(
    async (coinToApprove: string, callbacks?: CallbackProps) => {
      if (
        web3State !== Web3State.Done ||
        !chainId ||
        !IS_SUPPORTED_LEAGUES_CHAIN_ID(chainId) ||
        !factoryAddress
      ) {
        return;
      }
      try {
        // This amount is enough to play several games
        const tx = await approveToken(coinToApprove, factoryAddress, BigNumber.from('1000000').mul(BigNumber.from('10').pow(18)), getProvider());
        callbacks?.onSubmit(tx.hash);
        await tx.wait();
        callbacks?.onConfirmation(tx.hash);
      } catch (e) {
        callbacks?.onError(e);
      }
    },
    [web3State, chainId, factoryAddress, getProvider],
  );

  const onAbortGameCallback = useCallback(
    async (callbacks?: CallbackProps) => {
      if (
        web3State !== Web3State.Done ||
        !id ||
        !chainId ||
        !IS_SUPPORTED_LEAGUES_CHAIN_ID(chainId) ||
        !factoryAddress
      ) {
        return;
      }
      try {
        const tx = await abortGame(factoryAddress, getProvider(), id);
        await tx.wait();
        callbacks?.onSubmit(tx.hash);
        await tx.wait();
        callbacks?.onConfirmation(tx.hash);
      } catch (e) {
        callbacks?.onError(e);
      }
    },
    [web3State, id, factoryAddress, chainId, getProvider],
  );

  return {
    onStartGameCallback,
    onEndGameCallback,
    onAbortGameCallback,
    onJoinGameCallback,
    onApproveTokenCallback,
  };
};

export const useCoinLeagueFactoryWinner = (id?: string) => {
  const { web3State, account, getProvider } = useWeb3();
  const factoryAddress = useFactoryAddress();

  const winnerQuery = useQuery(
    ['GET_WINNER', id, account, web3State, factoryAddress],
    () => {
      if (!id || !account || web3State !== Web3State.Done || !factoryAddress) {
        return;
      }
      return getWinner(factoryAddress, account, getProvider(), id).then((w) => {
        return {
          place: w.place,
          address: w.winner_address,
          score: w.score,
          claimed: w.claimed,
        };
      });
    },
  );

  return {
    winner: winnerQuery.data && winnerQuery.data,
    refetchWinner: winnerQuery.refetch,
  };
};

export const useCoinLeagueFactoryCreateGameCallback = () => {
  const { web3State, getProvider } = useWeb3();
  const chainProvider = getProvider();
  const factoryAddress = useFactoryAddress();

  const onGameCreateCallback = useCallback(
    async (params: GameParamsV3, callbacks?: CallbackProps) => {
      if (web3State !== Web3State.Done || !factoryAddress) {
        return;
      }
      try {
        const tx = await createGame(factoryAddress, params, chainProvider);
        callbacks?.onSubmit(tx.hash);
        await tx.wait();
        callbacks?.onConfirmation(tx.hash);
      } catch (e) {
        console.log(e);
        callbacks?.onError(e);
      }
    },
    [web3State, factoryAddress, chainProvider],
  );
  return {
    onGameCreateCallback,
  };
};