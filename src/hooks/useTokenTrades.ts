import { useState, useEffect } from "react";
import { getTokenTrades} from "services/graphql/bitquery";
import { GET_NETWORK_NAME, EXCHANGE } from "shared/constants/Bitquery";
import { OrderData } from "types/app";

import useInterval from "./useInterval";
import { getTotalTokenTrades } from "services/graphql/bitquery/protocol";
import { useChainId } from "./useChainId";



/**
 * Use to fetch all trades related Currency
 * @param baseAddress 
 * @param exchange 
 */
export const useTokenTrades = (baseAddress: string | null, quoteAddress: string| null, exchange: EXCHANGE) =>{
    const {currentChainId } = useChainId()

    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(25);

    const [totalTrades, setTotalTrades] = useState<number>(0);

    const [fetchData, setFetchData] = useState<boolean>(false);
    // We use interval for constantly polling the data changing fetch data state
    useInterval(() => setFetchData(!fetchData), 30000, false)

    const [trades, setTrades] = useState<OrderData[]>([]);
    const [isLoadingTrades, setIsLoadingTrades] = useState(false);

    useEffect(() => { 
        setIsLoadingTrades(true);
        getTokenTrades(GET_NETWORK_NAME(currentChainId), exchange, baseAddress, quoteAddress,  rowsPerPage, page*rowsPerPage, null, null)
          .then(orders =>{ setIsLoadingTrades(false); setTrades(orders)})
          .catch(e =>  setIsLoadingTrades(false))
        let bAddress = baseAddress;
        let qAddress = quoteAddress;
      // Workaround or bug !!!, API not count if baseAddress is null, so we count as baseCurrency when we want only
      // the quote related count trades, the result is the same
        if(!baseAddress && quoteAddress){
          bAddress = quoteAddress;
          qAddress = null;
        }


        getTotalTokenTrades(GET_NETWORK_NAME(currentChainId), exchange, bAddress, qAddress, null, null)
        .then(result => setTotalTrades(result.totalTrades));

      }, [baseAddress, currentChainId, page, rowsPerPage, fetchData]);

    const onChangePage = (page: number)=> {
      setPage(page);
    }

    const onChangeRowsPerPage = (rows: number)=> {
      setRowsPerPage(rows);
    }

    return {isLoadingTrades, trades, totalTrades, onChangePage, onChangeRowsPerPage, page, rowsPerPage}
}