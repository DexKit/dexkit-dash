import {getWeb3Wrapper} from './web3modal';
import {providers} from 'ethers';
import {MultiCall} from '@indexed-finance/multicall';

let multicall: MultiCall;

export const getMulticall = async () => {
  if (!multicall) {
    const web3Wrapper = await getWeb3Wrapper();
    //@ts-ignore
    const provider = new providers.Web3Provider(web3Wrapper.getProvider());

    multicall = new MultiCall(provider);
  }
  return multicall;
};

export const getMulticallFromProvider = async (provider: any) => {
   return new MultiCall(provider);
};

export const getTokenBalances = async (tokens: string[], account: string) => {
  const multicall = await getMulticall();
  const tokensBal = await multicall.getBalances(tokens, account);
  return tokensBal;
};



export const getTokenBalance = async (token: string, account: string) => {
  const tokenBal = await getTokenBalances([token], account);
  return tokenBal;
};

export const getTokenBalancesAndAllowances = async (
  tokens: string[],
  account: string,
  spender: string,
) => {
  const multicall = await getMulticall();
  const tokensBal = await multicall.getBalancesAndAllowances(
    tokens,
    account,
    spender,
  );
  return tokensBal;
};

export const getTokenBalanceAndAllowance = async (
  token: string,
  account: string,
  spender: string,
) => {
  const tokensBal = await getTokenBalancesAndAllowances(
    [token],
    account,
    spender,
  );
  return tokensBal;
};
