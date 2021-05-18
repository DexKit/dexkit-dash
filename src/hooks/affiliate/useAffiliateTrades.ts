import { useQuery } from "@apollo/client/react/hooks/useQuery"
import { useChainId } from "hooks/useChainId"
import { useState } from "react"
import { BITQUERY_AFFILIATE_TRADES } from "services/graphql/bitquery/affiliate"
import { GetAffiliateTrades, GetAffiliateTradesVariables } from "services/graphql/bitquery/affiliate/__generated__/GetAffiliateTrades"
import { GET_ZRX_FLASH_WALLET } from "shared/constants/AppConst"
import { GET_NETWORK_NAME } from "shared/constants/Bitquery"


export const useAffiliateTrades = (affiliateAccount: string) => {
    const {currentChainId} = useChainId();

    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(25);
    
    const variables: GetAffiliateTradesVariables =
    {
        //@ts-ignore TODO, use the correct enum here
        network: GET_NETWORK_NAME(currentChainId),
        limit: rowsPerPage,
        offset: page*rowsPerPage,
        sender: GET_ZRX_FLASH_WALLET(currentChainId) as string,
        receiver: affiliateAccount
    } 
    const {data, loading, error} = useQuery<GetAffiliateTrades, GetAffiliateTradesVariables >(BITQUERY_AFFILIATE_TRADES, {variables})
    const onChangePage = (page: number)=> {
        setPage(page);
      }
  
      const onChangeRowsPerPage = (rows: number)=> {
        setRowsPerPage(rows);
      }

    return {data, loading, error,  onChangePage, onChangeRowsPerPage}
}