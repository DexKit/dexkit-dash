import { Interface } from '@ethersproject/abi';
import { CallInput } from '@indexed-finance/multicall';
import { ContractTransaction, ethers, providers } from 'ethers';
import { getMulticallFromProvider } from 'services/multicall';
import battleFactoryAbi from '../constants/ABI/BattleNFTFactory.json';
import { Coin, CreateAndJoinParams, Game, JoinGameParams } from '../utils/types';

export const getBattleFactoryContract = async (
  address: string,
  provider: any,
) => {
  const pr = new providers.Web3Provider(provider).getSigner();
  return new ethers.Contract(address, battleFactoryAbi, pr);
};

/**
 * return all games id's at once
 * @param games
 */
export const getGamesData = async (
  gameAddress: string,
  gameIds: string[],
  provider: any,
): Promise<Game[]> => {
  const iface = new Interface(battleFactoryAbi);
  const multicall = await getMulticallFromProvider(provider);
  const calls: CallInput[] = [];
  const games: Game[] = [];

  for (let index = 0; index < gameIds.length; index++) {
    const id = gameIds[index];
    calls.push({
      interface: iface,
      target: gameAddress,
      function: 'allGames',
      args: [id],
    });
  }
  const response = await multicall.multiCall(calls);
  const [, results] = response;

  for (let index = 0; index < results.length; index++) {
    const g = results[index];
    // @TODO check if this is returning with object notation, if not map it
    games.push(g);
  }
  return games;
};

/**
 * return all games id's at once
 * @param games
 */
export const getCoinFeedData = async (
  gameAddress: string,
  gameId: string,
  provider: any,
): Promise<Coin[]> => {
  const iface = new Interface(battleFactoryAbi);
  const multicall = await getMulticallFromProvider(provider);
  const calls: CallInput[] = [];
  const coins: Coin[] = [];
  calls.push({
    interface: iface,
    target: gameAddress,
    function: 'coin_player1',
    args: [gameId],
  });

  calls.push({
    interface: iface,
    target: gameAddress,
    function: 'coin_player2',
    args: [gameId],
  });

  const response = await multicall.multiCall(calls);
  const [, results] = response;
  coins.push(results[0]);
  coins.push(results[1]);
  return coins;
};

export const createAndJoinGame = async (
  gameAddress: string,
  params: CreateAndJoinParams,
  provider: any,
) => {
  return (
    await getBattleFactoryContract(gameAddress, provider)
  ).createAndJoinGame(
    params.championId,
    params.bittFeed,
    params.multiplier,
    params.startTimestamp,
    params.duration,
    params.entry,
    params.type,
    { value: params.entry },
  ) as Promise<ContractTransaction>;
};

export const joinGame = async (
  gameAddress: string,
  params: JoinGameParams,
  provider: any,
) => {
  return (await getBattleFactoryContract(gameAddress, provider)).joinGame(
    params.id,
    params.championId,
    params.bittFeed,
    params.multiplier,
    { value: params.entry },
  ) as Promise<ContractTransaction>;
};

export const startGame = async (
  gameAddress: string,
  id: number,
  provider: any,
) => {
  return (await getBattleFactoryContract(gameAddress, provider)).startGame(
    id,
  ) as Promise<ContractTransaction>;
};

export const endGame = async (
  gameAddress: string,
  id: number,
  provider: any,
) => {

  return (await getBattleFactoryContract(gameAddress, provider)).endGame(
    id,
  ) as Promise<ContractTransaction>;
};

export const claim = async (gameAddress: string, id: number, provider: any) => {
  return (await getBattleFactoryContract(gameAddress, provider)).claim(
    id,
  ) as Promise<ContractTransaction>;
};

export const abortGame = async (
  gameAddress: string,
  id: number,
  provider: any,
) => {
  return (
    await getBattleFactoryContract(gameAddress, provider)
  ).abortGameAndWithraw(id) as Promise<ContractTransaction>;
};

export const withdraw = async (
  gameAddress: string,
  id: number,
  provider: any,
) => {
  return (await getBattleFactoryContract(gameAddress, provider)).withdraw(
    id,
  ) as Promise<ContractTransaction>;
};

export const abortGameAndwithdraw = async (
  gameAddress: string,
  id: number,
  provider: any,
) => {
  return (
    await getBattleFactoryContract(gameAddress, provider)
  ).abortGameAndwithdraw(id) as Promise<ContractTransaction>;
};
