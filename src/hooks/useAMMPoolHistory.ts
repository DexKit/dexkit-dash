import { useState, useEffect } from "react";
import { getLastTradeByPair, getPool } from "services/graphql/bitquery";
import { GET_NETWORK_NAME} from "shared/constants/Bitquery";
import {  MintBurn } from "types/app";
import { GET_DEFAULT_QUOTE } from "shared/constants/Blockchain";
import Web3 from "web3";
import useInterval from "./useInterval";
import { getContractTotalEvents } from "services/graphql/bitquery/protocol";
import { useChainId } from "./useChainId";
import { EXCHANGE } from "shared/constants/AppEnums";


/**
 * Use to fetch all trades related to AMM logic, meaning we fetch per contract address
 * @param address 
 * @param exchange 
 */
export const useAMMPoolHistory = (address: string, exchange: EXCHANGE) =>{
    const {currentChainId } = useChainId()

    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(25);

    const [poolHistory, setPoolHistory] = useState<MintBurn[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const [totalEvents, setTotalEvents] = useState<number>(0);

    const [fetchData, setFetchData] = useState<boolean>(false);
    // We use interval for constantly polling the data changing fetch data state
    useInterval(() => setFetchData(!fetchData), 60000, false)

    const fetchPairData = (pairAddress: string, limit: number, offset: number) => { 
        setIsLoading(true);
        getPool(GET_NETWORK_NAME(currentChainId), exchange, address, GET_DEFAULT_QUOTE(currentChainId), limit, offset)
          .then(orders => { setPoolHistory(orders); setIsLoading(false) })
          .catch(e => setIsLoading(false))

        getContractTotalEvents(GET_NETWORK_NAME(currentChainId), exchange, pairAddress, ['Burn', 'Mint'])
        .then(result => setTotalEvents(result.totalEvents));

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
      }, [address, currentChainId, page, rowsPerPage, fetchData]);

    const onChangePage = (page: number)=> {
      setPage(page);
    }

    const onChangeRowsPerPage = (rows: number)=> {
      setRowsPerPage(rows);
    }

    return {isLoading, poolHistory, totalEvents, onChangePage, onChangeRowsPerPage, page, rowsPerPage}
}