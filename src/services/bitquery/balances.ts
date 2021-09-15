import {client} from 'services/graphql/bitquery';
import {BITQUERY_ALL_BALANCE_INFO} from 'services/graphql/bitquery/balance/gql';
import {
  GetAllMyBalance,
  GetAllMyBalanceVariables,
  GetAllMyBalance_ethereum_address_balances,
} from 'services/graphql/bitquery/balance/__generated__/GetAllMyBalance';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {MyBalances} from 'types/blockchain';

export const MapBalancesToNetwork = (
  balances: any,
  network: any,
  coin: string,
): MyBalances[] => {
  if (!balances) {
    return [];
  }
  return balances.map((t: any) => {
    const addr =
      t.currency?.address === '-' ? coin : t?.currency?.address?.toLowerCase();

    return (<MyBalances>{
      currency: {
        ...t.currency,
        address: addr,
      },
      network: network,
      value: t.value,
      // enquanto não vem a solução pela bitquery
    }) as MyBalances;
  });
};

export const MapNFTBalancesToNetwork = (
  balances: GetAllMyBalance_ethereum_address_balances[] | null | undefined,
  network: any,
  coin: string,
): MyBalances[] => {
  if (!balances) {
    return [];
  }
  return balances
    .filter((b) => b.currency?.tokenType === 'ERC721')
    .map((t: any) => {
      const addr =
        t.currency?.address === '-'
          ? coin
          : t?.currency?.address?.toLowerCase();

      return (<MyBalances>{
        currency: {
          ...t.currency,
          address: addr,
        },
        network: network,
        value: t.value,
        // enquanto não vem a solução pela bitquery
      }) as MyBalances;
    });
};

export const getAllBitqueryBalances = (account: string) => {
  return client
    .query<GetAllMyBalance, GetAllMyBalanceVariables>({
      query: BITQUERY_ALL_BALANCE_INFO,
      variables: {
        address: account,
      },
      errorPolicy: 'none',
    })
    .then((balances) => {
      const allMyBalances = MapBalancesToNetwork(
        balances.data.ethereum?.address[0].balances,
        EthereumNetwork.ethereum,
        'eth',
      )
        .concat(
          MapBalancesToNetwork(
            balances.data.bsc?.address[0].balances,
            EthereumNetwork.bsc,
            'bnb',
          ),
        )
        .concat(
          MapBalancesToNetwork(
            balances.data.matic?.address[0].balances,
            EthereumNetwork.matic,
            'matic',
          ),
        );
      const allMyNFTBalances = MapNFTBalancesToNetwork(
        balances.data.ethereum?.address[0].balances,
        EthereumNetwork.ethereum,
        'eth',
      )
        .concat(
          MapNFTBalancesToNetwork(
            balances.data.bsc?.address[0].balances,
            EthereumNetwork.bsc,
            'bnb',
          ),
        )
        .concat(
          MapNFTBalancesToNetwork(
            balances.data.matic?.address[0].balances,
            EthereumNetwork.matic,
            'matic',
          ),
        );

      return {
        balances: allMyBalances.filter((b) => b?.value && b?.value > 0) || [],
        nftBalances: allMyNFTBalances,
      };
    });
};
