import { useState, useEffect } from "react";
import { getLastTradeByPair, getContractOrders, getTotalContractOrders } from "services/graphql/bitquery";
import { GET_NETWORK_NAME } from "shared/constants/Bitquery";
import { OrderData } from "types/app";
import { GET_DEFAULT_QUOTE } from "shared/constants/Blockchain";
import Web3 from "web3";
import useInterval from "./useInterval";
import { useChainId } from "./useChainId";
import { EXCHANGE } from "shared/constants/AppEnums";


/**
 * Use to fetch all trades related to AMM logic by Pair, meaning we fetch per contract address
 * @param address 
 * @param exchange 
 */
export const useAMMPairTrades = (address: string, exchange: EXCHANGE) =>{
    const {currentChainId } = useChainId()

    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(25);

    const [totalTrades, setTotalTrades] = useState<number>(0);

    const [fetchData, setFetchData] = useState<boolean>(false);
    // We use interval for constantly polling the data changing fetch data state
    useInterval(() => setFetchData(!fetchData), 30000, false)

    const [trades, setTrades] = useState<OrderData[]>([]);
    const [isLoadingTrades, setIsLoadingTrades] = useState(false);
    const fetchPairData = (pairAddress: string, limit: number, offset: number) => { 
        setIsLoadingTrades(true);
        getContractOrders(GET_NETWORK_NAME(currentChainId), exchange, pairAddress, GET_DEFAULT_QUOTE(currentChainId), limit, offset, null, null)
        .then(orders => { setTrades(orders);   setIsLoadingTrades(false)})
        .catch(e =>   setIsLoadingTrades(false))

        getTotalContractOrders(GET_NETWORK_NAME(currentChainId), exchange, pairAddress, GET_DEFAULT_QUOTE(currentChainId), limit, offset, null, null)
        .then(result => setTotalTrades(result.totalTrades));

      }
     
      useEffect(() => {
        if (Web3.utils.isAddress(address)) {
          fetchPairData(address, rowsPerPage, page*rowsPerPage );
        }else{
          // We received a different url structure, parse and get pairAddress
          // TODO: investigate better ways to fetch pair
          const splitAddress = address.split('-');
          if(splitAddress.length > 1 && currentChainId){
            const baseAddress = splitAddress[0];
            getLastTradeByPair(GET_NETWORK_NAME(currentChainId), exchange, baseAddress, GET_DEFAULT_QUOTE(currentChainId))
            .then(pair => fetchPairData(pair, rowsPerPage, page*rowsPerPage))
          }
        }    
      }, [address, currentChainId, page, rowsPerPage, fetchData, exchange]);

    const onChangePage = (page: number)=> {
      setPage(page);
    }

    const onChangeRowsPerPage = (rows: number)=> {
      setRowsPerPage(rows);
    }

    return {isLoadingTrades, trades, totalTrades, onChangePage, onChangeRowsPerPage, page, rowsPerPage}
}