import { ContractWrappers } from '@0x/contract-wrappers';
// import { TxData } from 'ethereum-types';

//import { erc20Contract } from '../utils/contract_wrappers/erc20';

let contractWrappers: ContractWrappers;

export const initContractWrappers = (provider: any, chainId: number) => {
    if (!contractWrappers) {
        contractWrappers = new ContractWrappers(provider, { chainId });
    }
    return contractWrappers;
};

export const getContractWrappers = () => {
    if (!contractWrappers) {
      return null;
    }
    return contractWrappers;
};

/*export const getERC20ContractWrapper = async (provider: any, address: string, partialTxData: Partial<TxData>) => {
    return new erc20Contract(address, provider, partialTxData);
};*/
