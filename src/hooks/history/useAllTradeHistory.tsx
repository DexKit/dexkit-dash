import {useEffect, useState} from 'react';
import {useQuery} from '@apollo/client';
import usePagination from 'hooks/usePagination';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {POLL_INTERVAL} from 'shared/constants/AppConst';
import {BITQUERY_ALL_TRADE_HISTORY_LIST} from 'services/graphql/bitquery/history/gql';
import {
  GetAllTradeHistoryList,
  GetAllTradeHistoryListVariables,
  GetAllTradeHistoryList_ethereum_dexTrades,
} from 'services/graphql/bitquery/history/__generated__/GetAllTradeHistoryList';

interface Props {
  address: string;
  networkName: EthereumNetwork;
}

// Used when base currency is not passed
export const useAllTradeHistory = ({address, networkName}: Props) => {
  const {
    currentPage,
    rowsPerPage,
    skipRows,
    rowsPerPageOptions,
    onChangePage,
    onChangeRowsPerPage,
  } = usePagination();

  const [data, setData] = useState<
    GetAllTradeHistoryList_ethereum_dexTrades[]
  >();
  const [totalRows, setTotalRows] = useState<number>();
  // If there is no baseCurrency the API returns duplicated values, so we just multiply and then filter

  const {loading, error, data: dataFn} = useQuery<
    GetAllTradeHistoryList,
    GetAllTradeHistoryListVariables
  >(BITQUERY_ALL_TRADE_HISTORY_LIST, {
    variables: {
      network: networkName,

      // exchangeName: EXCHANGE.ALL, //GET_EXCHANGE_NAME(exchange),
      address: address,
      limit: Math.floor(rowsPerPage),
      offset: Math.floor(skipRows),
    },
    pollInterval: POLL_INTERVAL,
  });

  useEffect(() => {
    if (dataFn && dataFn?.ethereum?.dexTrades) {
      const total =
        dataFn?.ethereum?.total && dataFn?.ethereum?.total.length
          ? dataFn?.ethereum?.total[0].count || 0
          : 0;
      setTotalRows(total);
      setData(dataFn.ethereum.dexTrades);
    }
  }, [dataFn]);

  return {
    loading,
    error,
    data,
    totalRows,
    currentPage,
    rowsPerPage,
    rowsPerPageOptions,
    onChangePage,
    onChangeRowsPerPage,
  };
};
