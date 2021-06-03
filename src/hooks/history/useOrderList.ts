import { useChainId } from "../useChainId";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import usePagination from "hooks/usePagination";
import { EXCHANGE } from "shared/constants/AppEnums";
import { POLL_INTERVAL } from "shared/constants/AppConst";
import { GET_NETWORK_NAME } from "shared/constants/Bitquery";
import { BITQUERY_ORDER_LIST } from "services/graphql/bitquery/history/gql";
import { GetOrderList, GetOrderListVariables } from "services/graphql/bitquery/history/__generated__/GetOrderList";
import { IOrderList } from "types/app";

interface Props {
  address: string;
  baseCurrency?: string;
}

export const useOrderList = ({address, baseCurrency}: Props) =>{

  const { currentChainId } = useChainId();

  const { currentPage, rowsPerPage, skipRows, rowsPerPageOptions, onChangePage, onChangeRowsPerPage } = usePagination();

  const [data, setData] = useState<IOrderList[]>();
  const [totalRows, setTotalRows] = useState<number>();

  const { loading, error, data: dataFn } = useQuery<GetOrderList, GetOrderListVariables>(BITQUERY_ORDER_LIST, {
    variables: {
      network: GET_NETWORK_NAME(currentChainId),
      baseCurrency,
      // exchangeName: EXCHANGE.ALL, //GET_EXCHANGE_NAME(exchange),
      address: address,
      limit: Math.floor(rowsPerPage/2),
      offset: Math.floor(skipRows/2)
    },
    pollInterval: POLL_INTERVAL
  });
 
  useEffect(() => {
    if (dataFn && dataFn?.ethereum?.maker && dataFn?.ethereum?.taker) {
      const makerTrades: any[] = dataFn.ethereum.maker;
      const takerTrades: any[] = dataFn.ethereum.taker;
      const total = (dataFn.ethereum.makerCount && dataFn.ethereum.takerCount) ? ((dataFn.ethereum.makerCount[0].count || 0) + (dataFn.ethereum.takerCount[0].count || 0)) : 0;
      const allOrders = makerTrades.concat(takerTrades);

      setTotalRows(total);
 
      setData(allOrders.sort((a, b) => (b.block.height - a.block.height)).filter((thing, index, self) =>
        index === self.findIndex((t) => (
          t.transaction.hash === thing.transaction.hash
        )))
      );
     }
  }, [dataFn])

  // const handleChange = (event: React.ChangeEvent<{value: unknown}>) => {
  //   setFilterValue(event.target.value as FilterEvent);
    
  //   if (event.target.value === 'all') {
  //     setTableData(data);
  //   }
  //   else if (event.target.value === 'send') {
  //     setTableData(data.filter((data: TransferByAddress) => data.type === 'Send'));
  //   }
  //   else {
  //     setTableData(data.filter((data: TransferByAddress) => data.type === 'Receive'));
  //   }
  // }; 

  return { loading, error, data, totalRows, currentPage, rowsPerPage, rowsPerPageOptions, onChangePage, onChangeRowsPerPage };
}