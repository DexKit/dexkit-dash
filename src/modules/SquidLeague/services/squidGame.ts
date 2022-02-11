import {Interface} from '@ethersproject/abi';
import {CallInput} from '@indexed-finance/multicall';
import {BigNumber, ContractTransaction, ethers, providers} from 'ethers';
import {getMulticallFromProvider} from 'services/multicall';
import squidGameAbi from '../constants/ABI/SquidGame.json';
import {GameRoundData} from '../utils/types';

export const getSquidGameContract = async (address: string, provider: any) => {
  const pr = new providers.Web3Provider(provider).getSigner();
  return new ethers.Contract(address, squidGameAbi, pr);
};

export const joinGame = async (
  gameAddress: string,
  entry: BigNumber,
  provider: any,
) => {
  return (await getSquidGameContract(gameAddress, provider)).joinGame({
    value: entry,
  }) as Promise<ContractTransaction>;
};

export const playChallenge = async (
  gameAddress: string,
  play: boolean,
  provider: any,
) => {
  return (await getSquidGameContract(gameAddress, provider)).playChallenge(
    play,
  ) as Promise<ContractTransaction>;
};

export const withdraw = async (gameAddress: string, provider: any) => {
  return (
    await getSquidGameContract(gameAddress, provider)
  ).withdraw() as Promise<ContractTransaction>;
};
/**
 * Start, Setup and Finish it will be likely done by bots
 */
export const setupChallenge = async (gameAddress: string, provider: any) => {
  return (
    await getSquidGameContract(gameAddress, provider)
  ).setupChallenge() as Promise<ContractTransaction>;
};

export const startChallenge = async (gameAddress: string, provider: any) => {
  return (
    await getSquidGameContract(gameAddress, provider)
  ).startChallenge() as Promise<ContractTransaction>;
};

export const finishChallenge = async (gameAddress: string, provider: any) => {
  return (
    await getSquidGameContract(gameAddress, provider)
  ).finishChallenge() as Promise<ContractTransaction>;
};

export const getGameRoundData = async (
  gameAddress: string,
  currentRound: number,
  provider: any,
): Promise<GameRoundData> => {
  const iface = new Interface(squidGameAbi);
  const multicall = await getMulticallFromProvider(provider);
  const calls: CallInput[] = [];
  calls.push({
    interface: iface,
    target: gameAddress,
    function: 'CoinRound',
    args: [currentRound],
  });

  calls.push({
    interface: iface,
    target: gameAddress,
    function: 'getCurrentPlayers',
    args: [currentRound],
  });
  const response = await multicall.multiCall(calls);
  const [, results] = response;

  return {
    ...results[0],
    total_players: results[1],
  };
};
