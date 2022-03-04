import { Interface } from '@ethersproject/abi';
import { CallInput } from '@indexed-finance/multicall';
import { BigNumber, ContractTransaction, ethers, providers } from 'ethers';
import { getMulticallFromProvider } from 'services/multicall';
import squidGameAbi from '../constants/ABI/SquidGame.json';
import { GameRoundData, GameState } from '../utils/types';

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


export const getGameData = async (
  gameAddress: string,
  provider: any,
): Promise<{ round: BigNumber, pot: BigNumber, gameState: GameState }> => {
  const iface = new Interface(squidGameAbi);
  const multicall = await getMulticallFromProvider(provider);
  const calls: CallInput[] = [];
  calls.push({
    interface: iface,
    target: gameAddress,
    function: 'getCurrentRound',
  });

  calls.push({
    interface: iface,
    target: gameAddress,
    function: 'pot',
  });

  calls.push({
    interface: iface,
    target: gameAddress,
    function: 'gameState',
  });


  const response = await multicall.multiCall(calls);
  const [, results] = response;

  return {
    round: results[0] as BigNumber,
    pot: results[1] as BigNumber,
    gameState: results[2] as GameState,
  };

};

export const getGameRoundData = async (
  gameAddress: string,
  currentRound: number,
  provider: any,
): Promise<GameRoundData> => {
  const iface = new Interface(squidGameAbi);
  try {
    const multicall = await getMulticallFromProvider(provider);
    const calls: CallInput[] = [];
    console.log(currentRound);
    calls.push({
      interface: iface,
      target: gameAddress,
      function: 'CoinRound',
      args: [currentRound],
    });

    calls.push({
      interface: iface,
      target: gameAddress,
      function: 'getCurrentPlayersAtRound',
      args: [currentRound],
    });
    const response = await multicall.multiCall(calls);
    const [, results] = response;
    console.log(results);

    return {
      ...results[0],
      total_players: results[1] || BigNumber.from(0),
    };
  } catch (e) {
    console.log(e);
    throw new Error('stupid error');
  }
};
