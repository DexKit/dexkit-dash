import { ContractTransaction, ethers, providers } from 'ethers';
import squidGameFactoryAbi from '../constants/ABI/SquidGameFactory.json';
import { CreateSquidGameParams } from '../utils/types';

export const getSquidGameFactoryContract = async (
  address: string,
  provider: any,
) => {
  const pr = new providers.Web3Provider(provider).getSigner();
  return new ethers.Contract(address, squidGameFactoryAbi, pr);
};

export const createSquid = async (
  gameAddress: string,
  params: CreateSquidGameParams,
  provider: any,
) => {
  return (await getSquidGameFactoryContract(gameAddress, provider)).createSquid(
    params.startTimestamp,
    params.pot,
  ) as Promise<ContractTransaction>;
};

export const getGameAddress = async (
  gameId: string,
  gameFactoryAddress: string,
  provider: any,
) => {

  return (await (await getSquidGameFactoryContract(gameFactoryAddress, provider)).allGames(gameId)) as Promise<string>;
};


export const getLastGameId = async (
  gameFactoryAddress: string,
  provider: any,
) => {

  return (await (await getSquidGameFactoryContract(gameFactoryAddress, provider)).totalGames()) as Promise<number>;
};
