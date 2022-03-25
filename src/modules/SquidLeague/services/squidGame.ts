import { Interface } from '@ethersproject/abi';
import { CallInput } from '@indexed-finance/multicall';
import { BigNumber, ContractTransaction, ethers, providers } from 'ethers';
import { getMulticallFromProvider } from 'services/multicall';
import { ZERO_ADDRESS } from 'shared/constants/Blockchain';
import squidGameAbi from '../constants/ABI/SquidGame.json';
import { PlayingType } from '../constants/enum';
import { GameRoundData, GameState, GameData } from '../utils/types';

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
  play: PlayingType,
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
  account?: string
): Promise<GameData> => {
  try {
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

    calls.push({
      interface: iface,
      target: gameAddress,
      function: 'PlayersJoinedMap',
      args: [account ? account : ZERO_ADDRESS],
    });

    calls.push({
      interface: iface,
      target: gameAddress,
      function: 'getJoinedPlayers'
    });

    calls.push({
      interface: iface,
      target: gameAddress,
      function: 'startTimestamp'
    });

    calls.push({
      interface: iface,
      target: gameAddress,
      function: 'endTimestamp'
    });

    calls.push({
      interface: iface,
      target: gameAddress,
      function: 'lastChallengeTimestamp'
    });

    calls.push({
      interface: iface,
      target: gameAddress,
      function: 'PlayerWithdraw',
      args: [account ? account : ZERO_ADDRESS],
    });


    const response = await multicall.multiCall(calls);
    const [, results] = response;

    return {
      round: results[0] as BigNumber,
      pot: results[1] as BigNumber,
      gameState: results[2] as GameState,
      playerJoined: results[3] as boolean,
      joinedPlayers: results[4] as BigNumber,
      startTimestamp: results[5] as BigNumber,
      endTimestamp: results[6] as BigNumber,
      lastChallengeTimestamp: results[7] as BigNumber,
      playerWithdraw: results[8] as boolean
    };
  } catch (e) {
    console.log(e);
    throw new Error('error fetching gaming');
  }

};

export const getGameRoundData = async (
  gameAddress: string,
  currentRound: number,
  provider: any,
  account?: string,
): Promise<GameRoundData> => {
  const iface = new Interface(squidGameAbi);
  try {
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
      function: 'getCurrentPlayersAtRound',
      args: [currentRound],
    });

    calls.push({
      interface: iface,
      target: gameAddress,
      function: 'PlayersRoundMap',
      args: [currentRound, account ? account : ZERO_ADDRESS],
    });


    calls.push({
      interface: iface,
      target: gameAddress,
      function: 'PlayersPlay',
      args: [currentRound, account ? account : ZERO_ADDRESS],
    });

    calls.push({
      interface: iface,
      target: gameAddress,
      function: 'challengeResult',
      args: [currentRound],
    });

    calls.push({
      interface: iface,
      target: gameAddress,
      function: 'getPlayerCurrentChallengeResultAtRound',
      args: [account ? account : ZERO_ADDRESS, currentRound > 0 ? currentRound - 1 : currentRound],
    })

    calls.push({
      interface: iface,
      target: gameAddress,
      function: 'PlayersRoundMap',
      // here we are getting the past round, but sometimes we are passing round 0, so we need to make sure to not query negative round
      args: [currentRound > 0 ? currentRound - 1 : currentRound, account ? account : ZERO_ADDRESS],
    });

    calls.push({
      interface: iface,
      target: gameAddress,
      function: 'getCurrentRoundPriceFeed',
      // here we are getting the past round, but sometimes we are passing round 0, so we need to make sure to not query negative round
      args: [],
    });

    calls.push({
      interface: iface,
      target: gameAddress,
      function: 'getCurrentPlayersAtRound',
      args: [currentRound > 0 ? currentRound - 1 : currentRound],
    });



    const response = await multicall.multiCall(calls);
    const [, results] = response;

    return {
      ...results[0],
      total_players: results[1] || BigNumber.from(0),
      playerJoinedCurrentRound: results[2],
      playerPlayCurrentRound: results[3],
      challengeResultCurrentRound: results[4],
      playerCurrentRoundChallengeResult: results[5],
      playerJoinedPastRound: results[6],
      feedPriceCurrentRound: results[7],
      totalPlayersPastRound: results[8],
    };
  } catch (e) {
    console.log(e);
    throw new Error('error on gaming round');
  }
};
