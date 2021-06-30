import {useContext, useEffect, useState} from 'react';
import {useQuery} from '@apollo/client';
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
import {GET_CHAIN_FROM_NETWORK, GET_DEFAULT_QUOTE} from 'shared/constants/Blockchain';
import { EthereumNetwork } from '../../../__generated__/globalTypes';
import { FilterContext } from 'providers/protocol/filterContext';
import { getFilterValueById} from 'utils';
import { useRefreshRate } from 'hooks/useRefreshRate';

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
  const chainId =  GET_CHAIN_FROM_NETWORK(networkName);
  const {
    filters
  } = useContext(FilterContext);

  const from = getFilterValueById('from', filters);
  const to = getFilterValueById('to', filters);
  const tradeAmount = getFilterValueById('tradeAmount', filters);

  const {
    currentPage,
    rowsPerPage,
    skipRows,
    rowsPerPageOptions,
    onChangePage,
    onChangeRowsPerPage,
  } = usePagination();

  const [data, setData] = useState<GetTokenTrades_ethereum_dexTrades[]>();
  // const [totalRows, setTotalRows] = useState<number>();
  const {doRefetch, nextRefresh, refreshState} = useRefreshRate(12)

  const {loading, error, data: dataFn} = useQuery<GetTokenTrades, GetTokenTradesVariables>(BITQUERY_TOKEN_TRADES, {
    variables: {
      network:  networkName,
      exchangeName: GET_EXCHANGE_NAME(exchange) == '' ? undefined : GET_EXCHANGE_NAME(exchange),
      baseAddress: baseAddress,
      quoteAddress: quoteAddress || (GET_DEFAULT_QUOTE(chainId) as string),
      limit: rowsPerPage,
      offset: skipRows,
      from,
      till: to,
      tradeAmount: tradeAmount ? Number(tradeAmount) : null,
    },
    pollInterval: POLL_INTERVAL,
  });





  useEffect(() => {
    if (dataFn && dataFn.ethereum?.dexTrades) {
      const dexTrades: GetTokenTrades_ethereum_dexTrades[] = [...dataFn.ethereum?.dexTrades] || [];

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
  };
};
