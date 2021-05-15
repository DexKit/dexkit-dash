import { useState, useEffect, useContext } from "react";
import { getTokenTrades} from "services/graphql/bitquery";
import { GET_NETWORK_NAME } from "shared/constants/Bitquery";
import { OrderData } from "types/app";

import useInterval from "./useInterval";
import { getTotalTokenTrades } from "services/graphql/bitquery/protocol";
import { useChainId } from "./useChainId";
import { EXCHANGE } from "shared/constants/AppEnums";
import { FilterContext } from "providers/protocol/filterContext";
import { getFilterValueById } from "utils/filters";
import useDebounce from "./useDebounce";



/**
 * Use to fetch all trades related Currency
 * @param baseAddress 
 * @param exchange 
 */
export const useTokenTrades = (baseAddress: string | null, quoteAddress: string| null, exchange: EXCHANGE) =>{
    const {currentChainId } = useChainId()

    const {
      filters
    } = useContext(FilterContext);

    const from = getFilterValueById('from', filters);
    const to = getFilterValueById('to', filters);
    const tradeAmount = getFilterValueById('tradeAmount', filters);
    // const [tradeAmount] = useDebounce(tradeAm, 1000);

    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);

    const [totalTrades, setTotalTrades] = useState<number>(0);

    const [fetchData, setFetchData] = useState<boolean>(false);
    // We use interval for constantly polling the data changing fetch data state
    useInterval(() => setFetchData(!fetchData), 30000, false)

    const [trades, setTrades] = useState<OrderData[]>([]);
    const [isLoadingTrades, setIsLoadingTrades] = useState(false);

    useEffect(() => { 
        setIsLoadingTrades(true);
        getTokenTrades(GET_NETWORK_NAME(currentChainId), exchange, baseAddress, quoteAddress,  rowsPerPage, page*rowsPerPage, from, to, tradeAmount)
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


        getTotalTokenTrades(GET_NETWORK_NAME(currentChainId), exchange, bAddress, qAddress, from, to, tradeAmount)
        .then(result => setTotalTrades(result.totalTrades));

      }, [baseAddress, currentChainId, page, rowsPerPage, fetchData, from, to, tradeAmount]);

    const onChangePage = (page: number)=> {
      setPage(page);
    }

    const onChangeRowsPerPage = (rows: number)=> {
      setRowsPerPage(rows);
    }

    return {isLoadingTrades, trades, totalTrades, onChangePage, onChangeRowsPerPage, page, rowsPerPage}
}