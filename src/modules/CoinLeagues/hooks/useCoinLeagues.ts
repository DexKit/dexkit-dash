import { useNetworkProvider } from 'hooks/provider/useNetworkProvider';
import { useWeb3 } from 'hooks/useWeb3';
import { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { EthereumNetwork } from 'shared/constants/AppEnums';
import { ZERO_ADDRESS } from 'shared/constants/Blockchain';

import { Web3State } from 'types/blockchain';
import { COIN_LEAGUES_FACTORY_ADDRESS, COIN_LEAGUES_NFT_FACTORY_ADDRESS, DISABLE_CHAMPIONS_ID } from '../constants';
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
} from '../services/coinLeagues';
import {
  abortGame,
  endGame,
  getGameAddressFromId,
  startGame,
} from '../services/coinLeaguesFactory';

import {
  GET_LEAGUES_CHAIN_ID,
  IS_SUPPORTED_LEAGUES_CHAIN_ID,
} from '../utils/constants';
import { useIsNFTGame } from './useCoinLeaguesFactory';

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
export const useCoinLeagues = (id?: string) => {
  const { web3State, account, chainId, getProvider } = useWeb3();
  const provider = useNetworkProvider(
    EthereumNetwork.matic,
    GET_LEAGUES_CHAIN_ID(chainId),
  );
  const chainProvider = getProvider();

  const { room } = useParams<{ room: string }>();
  const isNFTGame = useIsNFTGame();


  const factoryAddress = useMemo(() => {
    return room
      ? room
      : isNFTGame
        ? COIN_LEAGUES_NFT_FACTORY_ADDRESS[GET_LEAGUES_CHAIN_ID(chainId)]
        : COIN_LEAGUES_FACTORY_ADDRESS[GET_LEAGUES_CHAIN_ID(chainId)];
  }, [chainId, room, isNFTGame]);

  const addressQuery = useQuery(
    ['GET_ADDRESS_GAME', id, factoryAddress],
    () => {
      if (!id || !factoryAddress) {
        return;
      }
      return getGameAddressFromId(factoryAddress, id);
    },
  );

  const address = useMemo(() => {
    if (addressQuery.data) {
      return addressQuery.data;
    }
  }, [addressQuery.data]);

  const winnerQuery = useQuery(['GET_WINNER', address, account], () => {
    if (!address || !account || web3State !== Web3State.Done) {
      return;
    }
    return getWinner(address, account, chainProvider).then((w) => {
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
      championId = DISABLE_CHAMPIONS_ID,
    ) => {
      if (web3State !== Web3State.Done || !address) {
        return;
      }
      try {
        const tx = await joinGame(
          address,
          feeds,
          amount,
          captainCoin,
          chainProvider,
          affiliate || ZERO_ADDRESS,
          championId,
        );
        callbacks?.onSubmit(tx.hash);
        await tx.wait();
        callbacks?.onConfirmation(tx.hash);
      } catch (e) {
        console.log(e);
        callbacks?.onError(e);
      }
    },
    [web3State, address, chainProvider],
  );
  const onClaimCallback = useCallback(
    async (winner: string, callbacks?: CallbackProps) => {
      if (web3State !== Web3State.Done || !address) {
        return;
      }
      try {
        const tx = await claim(address, chainProvider, winner);
        await tx.wait();
        callbacks?.onSubmit(tx.hash);
        await tx.wait();
        callbacks?.onConfirmation(tx.hash);
      } catch (e) {
        callbacks?.onError(e);
      }
    },
    [web3State, address, chainProvider],
  );

  const onWithdrawCallback = useCallback(
    async (callbacks?: CallbackProps) => {
      if (web3State !== Web3State.Done || !address || !account) {
        return;
      }
      try {
        const tx = await withdrawGame(address, chainProvider, account);
        await tx.wait();
        callbacks?.onSubmit(tx.hash);
        await tx.wait();
        callbacks?.onConfirmation(tx.hash);
      } catch (e) {
        callbacks?.onError(e);
      }
    },
    [web3State, address, chainProvider, account],
  );

  const gameQuery = useQuery(['GetGameAdddress', address], () => {
    if (!address || !provider) {
      return;
    }
    return getGamesData([address], provider);
  });
  const coinFeedQuery = useQuery(
    ['GetCoinsFeed', address, gameQuery.data],
    () => {
      if (!address || !gameQuery.data || !gameQuery.data[0] || !provider) {
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
        return getCoinFeeds(uniqueFeeds, address, provider);
      }
    },
  );

  const currentFeedPriceQuery = useQuery(
    ['GetCurrentFeedQuery', address, coinFeedQuery.data],
    () => {
      if (!address || !coinFeedQuery.data || !provider) {
        return;
      }
      // TODO: Error on query is returning data without being on object
      const feeds = coinFeedQuery.data.map((a) => a.address);
      if (feeds.length) {
        return getCurrentCoinFeedsPrice(feeds, address, provider);
      }
    },
  );

  const amountOnContractQuery = useQuery(
    ['AmountOnContractQuery', address, gameQuery.data, account],
    () => {
      if (
        !address ||
        !account ||
        !gameQuery.data ||
        !gameQuery.data[0]?.aborted
      ) {
        return;
      }
      return getAmountOnContract(address, account, provider);
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
    addressQuery,
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
  const { room } = useParams<{ room: string }>();
  const factoryAddress = useMemo(() => {
    return room
      ? room
      : isNFT
        ? COIN_LEAGUES_NFT_FACTORY_ADDRESS[GET_LEAGUES_CHAIN_ID(chainId)]
        : COIN_LEAGUES_FACTORY_ADDRESS[GET_LEAGUES_CHAIN_ID(chainId)];
  }, [chainId, room, isNFT]);
  const addressQuery = useQuery(
    ['GET_ADDRESS_GAME', id, factoryAddress],
    () => {
      if (!id || !factoryAddress) {
        return;
      }
      return getGameAddressFromId(factoryAddress, id);
    },
  );

  return useQuery(['GET_CHAMPIONS_ROOM', isNFT, addressQuery.data], () => {
    if (!isNFT || !addressQuery.data || !provider) {
      return
    }
    return getChampionRoom(addressQuery.data, provider);

  })

}

export const useCoinLeaguesCallbacks = (address?: string) => {
  const { web3State, chainId } = useWeb3();
  const isNFTGame = useIsNFTGame();
  const { room } = useParams<{ room: string }>();

  const factoryAddress = useMemo(() => {
    return room
      ? room
      : isNFTGame
        ? COIN_LEAGUES_NFT_FACTORY_ADDRESS[GET_LEAGUES_CHAIN_ID(chainId)]
        : COIN_LEAGUES_FACTORY_ADDRESS[GET_LEAGUES_CHAIN_ID(chainId)];
  }, [chainId, room, isNFTGame]);

  const onStartGameCallback = useCallback(
    async (callbacks?: CallbackProps) => {
      if (
        web3State !== Web3State.Done ||
        !address ||
        !chainId ||
        !IS_SUPPORTED_LEAGUES_CHAIN_ID(chainId) ||
        !factoryAddress
      ) {
        return;
      }
      try {
        const tx = await startGame(factoryAddress, address);
        callbacks?.onSubmit(tx.hash);
        await tx.wait();
        callbacks?.onConfirmation(tx.hash);
      } catch (e) {
        console.log(e);
        callbacks?.onError(e);
      }
    },
    [web3State, address, chainId, factoryAddress],
  );

  const onEndGameCallback = useCallback(
    async (callbacks?: CallbackProps) => {
      if (
        web3State !== Web3State.Done ||
        !address ||
        !chainId ||
        !IS_SUPPORTED_LEAGUES_CHAIN_ID(chainId) ||
        !factoryAddress
      ) {
        return;
      }
      try {
        const tx = await endGame(factoryAddress, address);
        callbacks?.onSubmit(tx.hash);
        await tx.wait();
        callbacks?.onConfirmation(tx.hash);
      } catch (e) {
        callbacks?.onError(e);
      }
    },
    [web3State, address, chainId, factoryAddress],
  );

  const onAbortGameCallback = useCallback(
    async (callbacks?: CallbackProps) => {
      if (
        web3State !== Web3State.Done ||
        !address ||
        !chainId ||
        !IS_SUPPORTED_LEAGUES_CHAIN_ID(chainId) ||
        !factoryAddress
      ) {
        return;
      }
      try {
        const tx = await abortGame(factoryAddress, address);
        await tx.wait();
        callbacks?.onSubmit(tx.hash);
        await tx.wait();
        callbacks?.onConfirmation(tx.hash);
      } catch (e) {
        callbacks?.onError(e);
      }
    },
    [web3State, address, factoryAddress, chainId],
  );

  return {
    onStartGameCallback,
    onEndGameCallback,
    onAbortGameCallback,
  };
};

export const useCoinLeaguesWinner = (address?: string) => {
  const { web3State, account, getProvider } = useWeb3();
  const winnerQuery = useQuery(
    ['GET_WINNER', address, account, web3State],
    () => {
      if (!address || !account || web3State !== Web3State.Done) {
        return;
      }
      return getWinner(address, account, getProvider()).then((w) => {
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
