import { useMemo } from 'react';
import { useWeb3 } from 'hooks/useWeb3';

import { getTokens } from 'services/rest/coingecko';
import { ChainId, MyBalances, Web3State } from 'types/blockchain';
import { useQuery } from 'react-query';
import { CoinItemCoinGecko } from 'types/coingecko/coin.interface';
import { getAllBitqueryBalances } from 'services/bitquery/balances';
import { getAllBlockchainBalances, getAllTestnetBlockchainBalances } from 'services/blockchain/balances';
import { providers } from 'ethers';
import { useCustomTokenList } from 'hooks/tokens';

import { useCustomNetworkList } from 'hooks/network';
import { NetworkParams } from 'redux/_settingsv2/actions';

export const MapBalancesToUSDValue = (
  balances: any,
  usdValues: { [address: string]: CoinItemCoinGecko },
): MyBalances[] => {
  if (!balances) {
    return [];
  }
  return balances.map((t: MyBalances) => {
    return {
      ...t,
      price24hPercentage:
        usdValues[t.currency?.address?.toLowerCase() || '']?.price_change_percentage_24h || 0,
      valueInUsd:
        (t.value || 0) *
        (usdValues[t.currency?.address?.toLowerCase() || '']?.current_price || 0),

      logoURI: usdValues[t.currency?.address?.toLowerCase() || '']?.image,
      // enquanto não vem a solução pela bitquery
    } as MyBalances;
  });
};

// Get balance from BSC, ETH, Matic at once
export const useAllBalance = (defaultAccount?: string) => {
  const { tokens } = useCustomTokenList();
  const { account: web3Account, chainId, web3State, getProvider } = useWeb3();
  const account = defaultAccount || web3Account;

  const { networks } = useCustomNetworkList();

  const myBalancesQuery = useQuery(
    ['GetMyBalancesQuery', account, chainId, web3State, networks, tokens],
    async () => {
      if (account) {
        // we use this to be able to test applications on Ropsten and Mumbai testnet
        if ((chainId === ChainId.Ropsten || chainId === ChainId.Mumbai) && web3State === Web3State.Done) {
          const pr = new providers.Web3Provider(getProvider());
          const result = await getAllTestnetBlockchainBalances(
            chainId,
            account,
            pr,
          );

          return result;
        }

        let result: { nftBalances: MyBalances[], balances: MyBalances[] } = {
          balances: [],
          nftBalances: [],
        };
        // Get all balances at all
        if (networks && networks.length) {
          for (let index = 0; index < networks.length; index++) {
            try {
              const network = networks[index] as NetworkParams;
              const pr = new providers.JsonRpcProvider(network.rpcUrl);
              const balances = await getAllBlockchainBalances(
                network.chainId,
                account,
                tokens,
                networks,
                pr,
              );

              result = { balances: [...balances.balances, ...result.balances], nftBalances: [] }

            } catch {

            }

          }
        }

        // On mainnet we return the normal tokens on BSC, Polygon and ETH
        const bitqueryResult = await getAllBitqueryBalances(account);
        const concat = { balances: [...bitqueryResult.balances, ...result.balances], nftBalances: [] }
        return concat;
      }
    },
    { staleTime: 1000 * 20 },
  );

  const usdValuesQuery = useQuery(
    ['GetCoingeckoUsdValues', myBalancesQuery.data],
    () => {
      const myBalances = myBalancesQuery.data;
      if (myBalances && myBalances.balances) {
        const tokens = myBalances.balances.map((b) => {
          return {
            network: b.network,
            chainId: b.chainId,
            address: b.currency?.address as string,
          };
        });
        return getTokens(tokens);
      }
    },
    { staleTime: 1000 * 20 },
  );
  const data = useMemo(() => {
    if (usdValuesQuery.data && myBalancesQuery.data?.balances) {
      return (
        MapBalancesToUSDValue(
          myBalancesQuery.data?.balances,
          usdValuesQuery.data,
        ).filter((b) => b?.value && b?.value > 0) || []
      );
    }
    if (myBalancesQuery.data?.balances) {
      return myBalancesQuery.data?.balances || [];
    }
    return [];
  }, [usdValuesQuery.data, myBalancesQuery.data]);

  const error = myBalancesQuery.isError && { message: 'Error Fetching Data' };

  return {
    loading: myBalancesQuery.isLoading,
    error,
    data,
    nftBalances: myBalancesQuery.data?.nftBalances,
    loadingUsd: usdValuesQuery.isLoading,
    errorUsd: usdValuesQuery.isError,
  };
};
