// import { assetDataUtils } from '@0x/order-utils';
import { ERC20TokenContract } from '@0x/contract-wrappers';
import { BigNumber } from '@0x/utils';
import { ChainId, TokenList } from '@types';
import { 
    COINGECKO_TOKENS_URL, 
    TOKEN_CONTRACT_ENDPOINT, 
    TRANSAK_API_URL 
} from 'utils/constants';
//import { Token, TokenBalance } from '../types/ethereum';
import { Token, TokenBalance } from 'types/app';
import { CoinDetailCoinGecko } from '../types/coingecko';
import { getContractWrappers } from './contract_wrappers';
import { getProvider } from './web3modal';
import { getMulticall } from './multicall';
import { getGasEstimationInfoAsync } from './gasPriceEstimation';

// export const tokensToTokenBalances = async (tokens: Token[], address: string, chainId: number): Promise<TokenBalance[]> => {
//     const contractWrappers = await getContractWrappers(chainId);
//     const assetDatas = tokens.map(t => assetDataUtils.encodeERC20AssetData(t.address));
//     const [balances, allowances] = await contractWrappers?.devUtils
//         .getBatchBalancesAndAssetProxyAllowances(address, assetDatas)
//         .callAsync() ?? [];
//     const tokenBalances = balances?.map((_b: any, i: any) => {
//         return {
//             token: tokens[i],
//             balance: balances[i],
//             isUnlocked: allowances != null ? allowances[i].isGreaterThan(0) : false,
//         };
//     }) ?? [];
//     return tokenBalances ;
// };

export async function Approve(approveTokenAddress: string, weiAmount: BigNumber, accountAddress: string): Promise<string>
{
    if(approveTokenAddress == null || approveTokenAddress.length === 0){
        return Promise.reject("Token address for approval cannot be null or empty");
    } 
    if(accountAddress == null || accountAddress.length === 0){
        return Promise.reject("Account address cannot be null or empty");
    }
    const gasInfo = await getGasEstimationInfoAsync();
    const provider = getProvider();
    if(provider == null){
        return Promise.reject("provider cannot be null");
    }
    const erc20Token = new ERC20TokenContract(approveTokenAddress, provider);
    return erc20Token.approve(approveTokenAddress, weiAmount)
    .sendTransactionAsync({
        from: accountAddress,
        gasPrice: gasInfo.gasPriceInWei
    });
}

//similar a consulta feita por onGetMyTokenBalances diferenciando q o de baixo trás o balances dos tokens informados 
export const tokensToTokenBalances = async (tokens: Token[], address: string, chainId: ChainId): Promise<TokenBalance[]> => {

    const contractWrappers = await getContractWrappers(chainId);
    const multicall = await getMulticall();
    const allowanceTarget = contractWrappers?.contractAddresses.erc20Proxy;
    if(allowanceTarget == null){
        return Promise.reject('erc20Proxy address is empty');
    }
    const tokenAddress = tokens.map(t => t.address);
    const [value, tokenBalancesAllowances] = await multicall.getBalancesAndAllowances(tokenAddress, address, allowanceTarget);
    console.log('balances on wei value', value);
    const tokenBalances = tokens.map((tk: Token, i: any) => {
        return {
            token: tk,
            balance: new BigNumber(tokenBalancesAllowances[tk.address].balance.toString()),
            approved:  new BigNumber(tokenBalancesAllowances[tk.address].allowance.toString())
        };
    });
    return tokenBalances;
};

export const tokenToTokenBalance = async (token: Token, address: string, chainId: number): Promise<TokenBalance> => {
    const [tokenBalance] = await tokensToTokenBalances([token], address, chainId);
    return tokenBalance;
};

export const getTokenBalance = async (token: Token, address: string, chainId: number): Promise<BigNumber> => {
    const balance = await tokenToTokenBalance(token, address, chainId);
    return balance.balance;
};

export const getTokenByAddress = async (address: string): Promise<CoinDetailCoinGecko> => {
    const promiseTokenDataResolved = await fetch(`${TOKEN_CONTRACT_ENDPOINT}${address.toLowerCase()}`);
    if (promiseTokenDataResolved.status === 200) {
        const data = await promiseTokenDataResolved.json();
        if (data) {
            return data;
        }
    }
    return Promise.reject('Could not get Token ');
};

export const getTokenIsUnlocked = async (token: Token, address: string, allowanceTarget: string, chainId: ChainId): Promise<boolean> => {
    if (allowanceTarget === '0x0000000000000000000000000000000000000000') {
        return true;
    }
    const contractWrappers = await getContractWrappers(chainId);
    const erc20Token = new ERC20TokenContract(token.address, contractWrappers?.getProvider() ?? getProvider());
    const allowance = await erc20Token.allowance(address, allowanceTarget).callAsync();
    const isUnlocked = allowance.isGreaterThan('10000e18');
    return isUnlocked;
};
export const getSupportFiatTokenAddresses = async (): Promise<string[]> => {

    const headers = new Headers({
        'content-type': 'application/json',
    });
    const init: RequestInit = {
        method: 'GET',
        headers,
    };
    try {
        const response = await fetch(TRANSAK_API_URL, init);
        if (response.ok && response.status === 200) {
            const jsonResponse = await response.json();
            return (jsonResponse).response.filter((r: any) => r.address).map((r: any) => r.address) as string[];
        } else {
            return [];
        }
    } catch{
        return [];
    }
}

export const  getCoingeckoTokenList = async () => {
    const headers = new Headers({
        'content-type': 'application/json',
    });
    const init: RequestInit = {
        method: 'GET',
        headers,
    };
    const response = await fetch(COINGECKO_TOKENS_URL, init);
    if (response.ok && response.status === 200) {
        return (await response.json()) as TokenList;
    } else {
        throw new Error(`Error fetching tokens list: ${response.status} `);
      
    }
}

