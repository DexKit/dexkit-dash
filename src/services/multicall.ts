import { getWeb3Wrapper } from './web3modal';
import { providers } from 'ethers';
import { MultiCall} from '@indexed-finance/multicall';

let multicall: MultiCall;

export const getMulticall = async () => {
    if (!multicall) {
        const web3Wrapper = await getWeb3Wrapper();
        //@ts-ignore
        const provider = new providers.Web3Provider(web3Wrapper.getProvider())
    
        multicall = new MultiCall(provider);
    }
    return multicall;
};


