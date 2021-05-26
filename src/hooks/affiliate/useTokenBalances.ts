import { useQuery } from "@apollo/client"
import { useChainId } from "hooks/useChainId";
import {  BITQUERY_MY_TOKEN_BALANCE_WITHOUT_HISTORY } from "services/graphql/bitquery/gql";
import { GetMyTokenBalanceWithoutHistoryVariables, GetMyTokenBalanceWithoutHistory } from "services/graphql/bitquery/__generated__/GetMyTokenBalanceWithoutHistory";
import { GET_BITQUERY_NETWORK_NAME } from "shared/constants/Bitquery";
import { DEXKIT } from "shared/constants/tokens";





export const useTokenBalancesAffiliate = (affiliateAccount: string) => {
    const {currentChainId} = useChainId();
   
    const variables: GetMyTokenBalanceWithoutHistoryVariables = {
        address: affiliateAccount,
        network: GET_BITQUERY_NETWORK_NAME(currentChainId),
    }
    const skip = !affiliateAccount;

    const {data, loading, error} = useQuery<GetMyTokenBalanceWithoutHistory, GetMyTokenBalanceWithoutHistoryVariables >(BITQUERY_MY_TOKEN_BALANCE_WITHOUT_HISTORY, {variables, skip} )
    const balances = data?.ethereum?.address.length ?  data?.ethereum?.address[0].balances : undefined;
    const kitToken = DEXKIT[currentChainId];
    const kitBalance = balances ? balances.find(b=> b.currency?.address?.toLowerCase() === kitToken?.address.toLowerCase()) : undefined;
    return {balances, loading, kitBalance }

}