import {getWeb3Wrapper} from './web3modal';
import {BigNumber, ethers, providers} from 'ethers';
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

export const getTokenBalances = async (
  tokens: string[],
  account: string,
  provider: any,
) => {
  const multicall = await getMulticallFromProvider(provider);
  const tokensBal = await multicall.getBalances(tokens, account);
  return tokensBal;
};

export const getTokenBalanceWithProvider = async (
  provider: any,
  address: string,
  tokenAddress: string,
) => {
  const contract = new ethers.Contract(
    tokenAddress,
    [
      'function balanceOf(address _owner) public view returns (uint256 balance)',
    ],
    provider,
  );

  return await contract.balanceOf(address);
};

export const getTokenBalancesWithProvider = async (
  provider: any,
  address: string,
  tokens: string[],
) => {
  const result: {[key: string]: ethers.BigNumber} = {};

  for (const token of tokens) {
    result[token] = await getTokenBalanceWithProvider(provider, address, token);
  }

  return result;
};

export const getTokenBalance = async (
  token: string,
  account: string,
  provider: any,
) => {
  const tokenBal = await getTokenBalances([token], account, provider);
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
