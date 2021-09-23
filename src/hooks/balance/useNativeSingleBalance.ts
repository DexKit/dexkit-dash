import {useWeb3} from 'hooks/useWeb3';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {useQuery} from 'react-query';
import {ChainId} from 'types/blockchain';
import {useNetworkProvider} from 'hooks/provider/useNetworkProvider';
import {getBalanceWithProvider} from 'services/web3modal';
import {ethers} from 'ethers';
import {BITQUERY_NATIVE_BALANCE_INFO} from 'services/graphql/bitquery/balance/gql';
import {client} from 'services/graphql/bitquery';
import {
  GetNativeSingleBalance,
  GetNativeSingleBalanceVariables,
} from 'services/graphql/bitquery/balance/__generated__/GetNativeSingleBalance';

// Use to get Native coins from network
export const useNativeSingleBalance = (
  address: string,
  networkName: EthereumNetwork,
  defaultAccount?: string,
) => {
  const {account: web3Account, chainId} = useWeb3();
  const account = defaultAccount || web3Account;
  const provider = useNetworkProvider(networkName, chainId);

  const nativeBalanceQuery = useQuery(
    ['GetNativeBalanceNetwork', provider, chainId, account],
    async () => {
      if (
        chainId &&
        (chainId === ChainId.Ropsten || chainId === ChainId.Mumbai) &&
        provider &&
        account
      ) {
        const ethBalance = await getBalanceWithProvider(account, provider);
        // const coin =  ETHEREUM_NATIVE_COINS_BY_CHAIN[chainId];
        return Number(ethers.utils.formatEther(ethBalance || '0')) || 0;
        /* return {
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
       network: networkName,
       price24hPercentage: 0,
     }*/
      }
      if (address && account) {
        return client
          .query<GetNativeSingleBalance, GetNativeSingleBalanceVariables>({
            query: BITQUERY_NATIVE_BALANCE_INFO,
            variables: {
              network: networkName,
              address: account as string,
            },
            errorPolicy: 'none',
          })
          .then((dataFn) => {
            if (
              dataFn.data &&
              dataFn.data.ethereum?.address &&
              dataFn.data.ethereum.address.length &&
              dataFn.data.ethereum.address[0].balance
            ) {
              return dataFn.data.ethereum.address[0].balance;
            }
          });
      }
    },
  );

  return {
    loading: nativeBalanceQuery.isLoading,
    error: nativeBalanceQuery.isError,
    data: nativeBalanceQuery.data && nativeBalanceQuery.data,
  };
};
