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
