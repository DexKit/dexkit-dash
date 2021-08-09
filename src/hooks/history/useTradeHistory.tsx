import {useEffect, useState} from 'react';
import {useQuery} from '@apollo/client';
import usePagination from 'hooks/usePagination';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import {POLL_INTERVAL} from 'shared/constants/AppConst';
import {BITQUERY_TRADE_HISTORY_LIST} from 'services/graphql/bitquery/history/gql';
import {
  GetTradeHistoryList,
  GetTradeHistoryListVariables,
  GetTradeHistoryList_ethereum_dexTrades,
} from 'services/graphql/bitquery/history/__generated__/GetTradeHistoryList';
import {getCurrency} from 'utils/bitquery';
interface Props {
  address: string;
  baseCurrency?: string;
  networkName: EthereumNetwork;
}

export const useTradeHistory = ({
  address,
  baseCurrency,
  networkName,
}: Props) => {
  const {
    currentPage,
    rowsPerPage,
    skipRows,
    rowsPerPageOptions,
    onChangePage,
    onChangeRowsPerPage,
  } = usePagination();

  const [data, setData] = useState<GetTradeHistoryList_ethereum_dexTrades[]>();
  const [totalRows, setTotalRows] = useState<number>();
  // If there is no baseCurrency the API returns duplicated values, so we just multiply and then filter
  let multiplier = 2;
  if (baseCurrency) {
    multiplier = 1;
  }

  const {loading, error, data: dataFn} = useQuery<
    GetTradeHistoryList,
    GetTradeHistoryListVariables
  >(BITQUERY_TRADE_HISTORY_LIST, {
    variables: {
      network: networkName,
      baseCurrency: getCurrency(networkName, baseCurrency),
      // exchangeName: EXCHANGE.ALL, //GET_EXCHANGE_NAME(exchange),
      address: address,
      limit: Math.floor(rowsPerPage * multiplier),
      offset: Math.floor(skipRows * multiplier),
    },
    pollInterval: POLL_INTERVAL,
  });

  useEffect(() => {
    if (dataFn && dataFn?.ethereum?.dexTrades) {
      const total =
        dataFn?.ethereum?.total && dataFn?.ethereum?.total.length
          ? dataFn?.ethereum?.total[0].count || 0
          : 0;
      setTotalRows(total / multiplier);
      if (baseCurrency) {
        setData(dataFn.ethereum.dexTrades);
      } else {
        setData(
          dataFn.ethereum.dexTrades.filter(
            (value, index, self) =>
              self
                .map((s) => s.transaction?.hash)
                .indexOf(value.transaction?.hash) === index &&
              self
                .map((s) => s.transaction?.index)
                .indexOf(value.transaction?.index) === index,
          ),
        );
      }
    }
  }, [dataFn]);

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
