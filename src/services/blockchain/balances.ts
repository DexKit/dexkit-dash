import {ethers} from 'ethers';
import {getTokenBalances} from 'services/multicall';
import {getBalanceWithProvider} from 'services/web3modal';
import {GET_NETWORK_NAME} from 'shared/constants/Bitquery';
import {ETHEREUM_NATIVE_COINS_BY_CHAIN} from 'shared/constants/Coins';
import {TOKENS_LIST} from 'shared/constants/tokens';
import {ChainId, MyBalances} from 'types/blockchain';

import * as settingTypes from 'modules/Settings/types';

export const getAllBlockchainBalances = async (
  chainId: ChainId,
  account: string,
  customTokens: any[],
  customNetworks: settingTypes.Network[],
  provider: ethers.providers.JsonRpcProvider,
) => {
  const tokens = TOKENS_LIST[chainId] || [];

  const otherTokens = customTokens
    .filter((t) => t.chainId === chainId)
    .filter((t) => tokens?.findIndex((a) => a.address !== t.address) === -1);

  const [, tb] = await getTokenBalances(
    [
      ...(tokens?.map((t) => t.address) as string[]),
      ...otherTokens.map((t) => t.address),
    ],
    account,
    provider,
  );

  const tokensWithBalance =
    tokens?.map((t) => {
      return {
        currency: {
          __typename: 'Currency',
          name: t.name,
          symbol: t.symbol,
          decimals: t.decimals,
          address: t.address,
          tokenType: 'ERC20',
        },
        value:
          Number(ethers.utils.formatUnits(tb[t.address] || '0', t.decimals)) ||
          0,
        valueInUsd: 0,
        __typename: 'EthereumBalance',
        network: t.name,
        price24hPercentage: 0,
        logoURI: t.logoURI,
        isCustomNetwork: true,
      } as MyBalances;
    }) || [];

  const customTokensWithBalance = customTokens.map((t) => {
    return {
      currency: {
        __typename: 'Currency',
        name: t.name,
        symbol: t.symbol,
        decimals: t.decimals,
        address: t.address,
        tokenType: 'ERC20',
      },
      value:
        Number(ethers.utils.formatUnits(tb[t.address] || '0', t.decimals)) || 0,
      valueInUsd: 0,
      __typename: 'EthereumBalance',
      network: t.name,
      price24hPercentage: 0,
      logoURI: t.logoURI,
      isCustomNetwork: true,
    } as MyBalances;
  });

  const bal: MyBalances[] = [...tokensWithBalance, ...customTokensWithBalance];

  const ethBalance = await provider.getBalance(account);

  let coin = ETHEREUM_NATIVE_COINS_BY_CHAIN[chainId];

  if (!coin) {
    const index = customNetworks.findIndex((n) => n.chainId === chainId);

    if (index > -1) {
      coin = {
        name: customNetworks[index].name,
        symbol: customNetworks[index].nativeTokenSymbol,
        decimals: 18,
        address: customNetworks[index].nativeTokenSymbol,
      };
    }
  }

  const ethToken = {
    currency: {
      __typename: 'Currency',
      name: coin.name,
      symbol: coin.symbol,
      decimals: coin.decimals,
      address: coin.address.toLowerCase(),
      tokenType: 'ERC20',
    },
    value: Number(ethers.utils.formatEther(ethBalance || '0')) || 0,
    valueInUsd: 0,
    __typename: 'EthereumBalance',
    network: coin.name,
    price24hPercentage: 0,
    chainId: chainId,
    isCustomNetwork: true,
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  bal.push(ethToken);

  return {balances: bal as MyBalances[], nftBalances: [] as MyBalances[]};
};


export const getAllTestnetBlockchainBalances = async (
  chainId: ChainId,
  account: string,
  provider: any,
) => {
  const tokens = TOKENS_LIST[chainId] || [];

  const [, tb] = await getTokenBalances(
    [
      ...(tokens?.map((t) => t.address) as string[]),
   
    ],
    account,
    provider,
  );

  const tokensWithBalance =
    tokens?.map((t) => {
      return {
        currency: {
          __typename: 'Currency',
          name: t.name,
          symbol: t.symbol,
          decimals: t.decimals,
          address: t.address,
          tokenType: 'ERC20',
        },
        value:
          Number(ethers.utils.formatUnits(tb[t.address] || '0', t.decimals)) ||
          0,
        valueInUsd: 0,
        __typename: 'EthereumBalance',
        network: t.name,
        price24hPercentage: 0,
        logoURI: t.logoURI,
      } as MyBalances;
    }) || [];

  
  const bal: MyBalances[] = [...tokensWithBalance];

  const ethBalance = await getBalanceWithProvider(account, provider);

  let coin = ETHEREUM_NATIVE_COINS_BY_CHAIN[chainId];


  const ethToken = {
    currency: {
      __typename: 'Currency',
      name: coin.name,
      symbol: coin.symbol,
      decimals: coin.decimals,
      address: coin.address,
      tokenType: 'ERC20',
    },
    value: Number(ethers.utils.formatEther(ethBalance || '0')) || 0,
    valueInUsd: 0,
    __typename: 'EthereumBalance',
    network: GET_NETWORK_NAME(chainId),
    price24hPercentage: 0,
    chainId: chainId,
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  bal.push(ethToken);

  return {balances: bal as MyBalances[], nftBalances: [] as MyBalances[]};
};

const ABI = [
  'function balanceOf(address _owner) public view returns (uint256 balance)',
  'function decimals() public view returns (uint8)',
];

export async function getTokenBalanceOf(
  provider: any,
  contractAddress: string,
  address: string,
) {
  const contract = new ethers.Contract(
    contractAddress,
    ABI,
    new ethers.providers.Web3Provider(provider).getSigner(),
  );

  const balance = parseInt(
    ethers.utils.formatUnits(
      await contract.balanceOf(address),
      await contract.decimals(),
    ),
  );

  return balance;
}
