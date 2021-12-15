import {useContext, useEffect, useState} from 'react';
import {NetworkStatus, useQuery} from '@apollo/client';
import usePagination from 'hooks/usePagination';
import {
  GetTokenTrades,
  GetTokenTradesVariables,
  GetTokenTrades_ethereum_dexTrades,
} from 'services/graphql/bitquery/protocol/__generated__/GetTokenTrades';
import {BITQUERY_TOKEN_TRADES} from 'services/graphql/bitquery/protocol/gql';
import {POLL_INTERVAL} from 'shared/constants/AppConst';
import {GET_EXCHANGE_NAME} from 'shared/constants/Bitquery';
import {EXCHANGE} from 'shared/constants/AppEnums';
import {
  GET_CHAIN_FROM_NETWORK,
  GET_DEFAULT_QUOTE,
  GET_DEFAULT_USD_TOKEN_BY_NETWORK,
} from 'shared/constants/Blockchain';

import {EthereumNetwork} from '../../../__generated__/globalTypes';
import {FilterContext} from 'providers/protocol/filterContext';
import {getFilterValueById} from 'utils';
import {getAfer24HoursDate} from 'utils/time_utils';
import useInterval from 'hooks/useInterval';

interface Props {
  baseAddress: string | null;
  quoteAddress: string | null;
  exchange: EXCHANGE;
  networkName: EthereumNetwork;
}
export const useTokenTrades = ({
  baseAddress,
  quoteAddress,
  exchange,
  networkName,
}: Props) => {
  const chainId = GET_CHAIN_FROM_NETWORK(networkName);

  const [toDate, setTo] = useState(getAfer24HoursDate());
  const [seconds, setSeconds] = useState(0);
  const {filters} = useContext(FilterContext);

  const from = getFilterValueById('from', filters);
  const toFilter = getFilterValueById('to', filters);
  const tradeAmount = getFilterValueById('tradeAmount', filters);
  // TODO: investigate
  useInterval(
    () => {
      if (!toFilter) {
        setTo(new Date(getAfer24HoursDate()));
      }
    },
    POLL_INTERVAL,
    false,
  );

  useInterval(() => {
    setSeconds(seconds + 1);
  }, 1000);
  const to = toFilter || toDate;

  const {
    currentPage,
    rowsPerPage,
    skipRows,
    rowsPerPageOptions,
    onChangePage,
    onChangeRowsPerPage,
  } = usePagination();

  const [data, setData] = useState<GetTokenTrades_ethereum_dexTrades[]>();

  const {
    loading,
    error,
    data: dataFn,
    networkStatus,
  } = useQuery<GetTokenTrades, GetTokenTradesVariables>(BITQUERY_TOKEN_TRADES, {
    variables: {
      network: networkName,
      exchangeName:
        GET_EXCHANGE_NAME(exchange) === ''
          ? undefined
          : GET_EXCHANGE_NAME(exchange),
      baseAddress: baseAddress,
      quoteAddress:
        quoteAddress ||
        baseAddress?.toLowerCase() ===
          (GET_DEFAULT_QUOTE(chainId) as string)?.toLowerCase()
          ? (GET_DEFAULT_USD_TOKEN_BY_NETWORK(networkName) as string)
          : (GET_DEFAULT_QUOTE(chainId) as string),
      limit: rowsPerPage,
      offset: skipRows,
      from,
      till: to,
      tradeAmount: tradeAmount ? Number(tradeAmount) : null,
    },
    pollInterval: POLL_INTERVAL,
  });
  useEffect(() => {
    if (networkStatus === NetworkStatus.ready) {
      setSeconds(0);
    }
  }, [networkStatus]);

  useEffect(() => {
    if (dataFn && dataFn.ethereum?.dexTrades) {
      const dexTrades: GetTokenTrades_ethereum_dexTrades[] =
        [...dataFn.ethereum?.dexTrades] || [];

      const newData = dexTrades
        .sort((a, b) => (b.block?.height || 0) - (a.block?.height || 0))
        .filter(
          (thing, index, self) =>
            index ===
            self.findIndex(
              (t) => t.transaction?.hash === thing.transaction?.hash,
            ),
        );

      setData(newData);
    }
  }, [dataFn]);

  return {
    loading,
    error,
    data,
    currentPage,
    rowsPerPage,
    rowsPerPageOptions,
    onChangePage,
    onChangeRowsPerPage,
    nextRefresh: (seconds / (POLL_INTERVAL / 1000)) * 100,
    seconds,
  };
};
