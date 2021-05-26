import { useQuery } from "@apollo/client/react/hooks/useQuery"
import { useChainId } from "hooks/useChainId"
import { FilterContext } from "providers/protocol/filterContext"
import { useContext, useEffect, useState } from "react"
import { BITQUERY_AFFILIATE_TRADES, BITQUERY_TOTAL_AFFILIATE_TRADES } from "services/graphql/bitquery/affiliate"
import { GetAffiliateTrades, GetAffiliateTradesVariables } from "services/graphql/bitquery/affiliate/__generated__/GetAffiliateTrades"
import { GetTotalAffiliateTradesVariables, GetTotalAffiliateTrades } from "services/graphql/bitquery/affiliate/__generated__/GetTotalAffiliateTrades"
import { GET_ZRX_FLASH_WALLET } from "shared/constants/AppConst"
import { GET_BITQUERY_NETWORK_NAME } from "shared/constants/Bitquery"
import { getFilterValueById } from "utils/filters"


export const useAffiliateTrades = (affiliateAccount: string) => {
    const {currentChainId} = useChainId();
    const {
      filters
    } = useContext(FilterContext);

    const from = getFilterValueById('from', filters);
    const to = getFilterValueById('to', filters);
    const tradeAmount = getFilterValueById('tradeAmount', filters);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(25);


    const variables: GetAffiliateTradesVariables =
    {
        network: GET_BITQUERY_NETWORK_NAME(currentChainId),
        limit: rowsPerPage,
        offset: page*rowsPerPage,
        sender: GET_ZRX_FLASH_WALLET(currentChainId) as string,
        receiver: affiliateAccount,
        from: from,
        till: to,
        tradeAmount: tradeAmount
    } 
    const skip = !affiliateAccount;

    const {data, loading, error, refetch} = useQuery<GetAffiliateTrades, GetAffiliateTradesVariables >(BITQUERY_AFFILIATE_TRADES, {variables, skip} )
    
  
    const totalData = useQuery<GetTotalAffiliateTrades, GetTotalAffiliateTradesVariables >(BITQUERY_TOTAL_AFFILIATE_TRADES, {variables, skip})

    const total = totalData.data?.ethereum?.transfers?.length ? totalData.data?.ethereum?.transfers[0].count : 0;
    const valueTotalUSD = totalData.data?.ethereum?.transfers?.length ? totalData.data?.ethereum?.transfers[0].amountUSD : 0;
    const onChangePage = (page: number)=> {
        setPage(page);
    }
  
      const onChangeRowsPerPage = (rows: number)=> {
        setRowsPerPage(rows);
      }

    return {data, loading, error,  onChangePage, onChangeRowsPerPage, page, rowsPerPage, total, valueTotalUSD}
}