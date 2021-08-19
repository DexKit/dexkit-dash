import {ContractWrappers} from '@0x/contract-wrappers';
import {ChainId} from 'types/blockchain';
import {getWeb3Wrapper} from './web3modal';
// import { TxData } from 'ethereum-types';

//import { erc20Contract } from '../utils/contract_wrappers/erc20';

let contractWrappers: ContractWrappers;

export const initContractWrappers = (provider: any, chainId: number) => {
  if (!contractWrappers) {
    contractWrappers = new ContractWrappers(provider, {chainId});
  }
  return contractWrappers;
};

export const getContractWrappers = (chainId: ChainId | undefined) => {
  if (!contractWrappers) {
    const web3Wrapper = getWeb3Wrapper();
    if (!web3Wrapper) {
      return null;
    }
    contractWrappers = new ContractWrappers(web3Wrapper?.getProvider(), {
      chainId: chainId || 1,
    });
  }
  return contractWrappers;
};

// export const getERC20ContractWrapper = async (provider: any, address: string, partialTxData: Partial<TxData>) => {
//     return new erc20Contract(address, provider, partialTxData);
// };
