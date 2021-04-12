import { ContractWrappers } from '@0x/contract-wrappers';
import { getWeb3Wrapper } from './web3modal';
import { CHAIN_ID } from 'utils/constants';
// import { TxData } from 'ethereum-types';

//import { erc20Contract } from '../utils/contract_wrappers/erc20';

let contractWrappers: ContractWrappers;

export const initContractWrappers = (provider: any, chainId: number) => {
    if (!contractWrappers) {
        contractWrappers = new ContractWrappers(provider, { chainId });
    }
    return contractWrappers;
};

export const getContractWrappers = (chainId: number = CHAIN_ID) => {  
    if (!contractWrappers) {
        const web3Wrapper = getWeb3Wrapper();
        if(!web3Wrapper){
            return null;
        }
        contractWrappers = new ContractWrappers(web3Wrapper?.getProvider(), { chainId });
    }
    return contractWrappers;
};

// export const getERC20ContractWrapper = async (provider: any, address: string, partialTxData: Partial<TxData>) => {
//     return new erc20Contract(address, provider, partialTxData);
// };
