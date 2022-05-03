import { useQuery } from '@apollo/client';
import { BITQUERY_BALANCE_INFO } from 'services/graphql/bitquery/balance/gql';
import {
  GetMyBalance,
  GetMyBalanceVariables,
} from 'services/graphql/bitquery/balance/__generated__/GetMyBalance';
import { GET_NETWORK_NAME } from 'shared/constants/Bitquery';
import { DEXKIT } from 'shared/constants/tokens';
import { ChainId } from 'types/blockchain';

export const useTokenBalancesAffiliate = (affiliateAccount: string, chainId: ChainId) => {

  const variables: GetMyBalanceVariables = {
    address: affiliateAccount,
    network: GET_NETWORK_NAME(chainId),
  };
  const skip = !affiliateAccount;

  const { data, loading } = useQuery<GetMyBalance, GetMyBalanceVariables>(
    BITQUERY_BALANCE_INFO,
    { variables, skip },
  );
  const balances = data?.ethereum?.address.length
    ? data?.ethereum?.address[0].balances
    : undefined;
  const kitToken = DEXKIT[chainId];
  const kitBalance = balances
    ? balances.find(
      (b) =>
        b.currency?.address?.toLowerCase() ===
        kitToken?.address.toLowerCase(),
    )
    : undefined;
  return { balances, loading, kitBalance };
};
