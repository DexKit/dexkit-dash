import { ethers } from "ethers";
import { getTokenBalances } from "services/multicall";
import { getBalance } from "services/web3modal";
import { GET_NETWORK_NAME } from "shared/constants/Bitquery";
import { ETHEREUM_NATIVE_COINS_BY_CHAIN } from "shared/constants/Coins";
import { TOKENS_LIST } from "shared/constants/tokens";
import { ChainId, MyBalances } from "types/blockchain";



export const getAllBlockchainBalances = async (chainId: ChainId, account: string) => {
    const tokens = TOKENS_LIST[chainId];
    const [, tb] = await getTokenBalances(
      tokens?.map((t) => t.address) as string[],
      account,
    );
   
   const bal: MyBalances[] =  tokens?.map((t) => {
      return {
        currency: {
          __typename: "Currency",
          name: t.name,
          symbol:t.symbol,
          decimals:  t.decimals,
          address: t.address,
          tokenType: 'ERC20',
        },
        value: Number(ethers.utils.formatUnits(tb[t.address] || '0', t.decimals)) || 0,
        valueInUsd: 0,
        __typename: "EthereumBalance",
        network: GET_NETWORK_NAME(chainId),
        price24hPercentage: 0,
        logoURI: t.logoURI,
        

      } as MyBalances;
    }) || [];
    const ethBalance = await getBalance(account);
    const coin =  ETHEREUM_NATIVE_COINS_BY_CHAIN[chainId];
    const ethToken = {
      currency: {
        __typename: "Currency",
        name: coin.name,
        symbol: coin.symbol,
        decimals:  coin.decimals,
        address: coin.address,
        tokenType: 'ERC20',
      },
      value: Number(ethers.utils.formatEther(ethBalance || '0')) || 0,
      valueInUsd: 0,
      __typename: "EthereumBalance",
      network: GET_NETWORK_NAME(chainId),
      price24hPercentage: 0,

    }
    //@ts-ignore
    bal.push(ethToken);


    return {balances: bal as MyBalances[], nftBalances: [] as MyBalances[]}


}