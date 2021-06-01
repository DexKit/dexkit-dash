import {useEffect, useState} from 'react';
import {useQuery} from '@apollo/client';
import {useChainId} from '../useChainId';
import usePagination from 'hooks/usePagination';
import {
  GetTokenTrades,
  GetTokenTradesVariables,
  GetTokenTrades_ethereum_dexTrades,
} from 'services/graphql/bitquery/protocol/__generated__/GetTokenTrades';
import {BITQUERY_TOKEN_TRADES} from 'services/graphql/bitquery/protocol/gql';
import {POLL_INTERVAL} from 'shared/constants/AppConst';
import {GET_EXCHANGE_NAME, GET_NETWORK_NAME} from 'shared/constants/Bitquery';
import {EXCHANGE} from 'shared/constants/AppEnums';
import {GET_DEFAULT_QUOTE} from 'shared/constants/Blockchain';

interface Props {
  baseAddress: string | null;
  quoteAddress: string | null;
  exchange: EXCHANGE;
}
export const useTokenTrades = ({
  baseAddress,
  quoteAddress,
  exchange,
}: Props) => {
  const {currentChainId} = useChainId();

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

  const {loading, error, data: dataFn} = useQuery<GetTokenTrades, GetTokenTradesVariables>(BITQUERY_TOKEN_TRADES, {
    variables: {
      network: GET_NETWORK_NAME(currentChainId),
      exchangeName: GET_EXCHANGE_NAME(exchange) == '' ? undefined : GET_EXCHANGE_NAME(exchange),
      baseAddress: baseAddress,
      quoteAddress: quoteAddress || (GET_DEFAULT_QUOTE(currentChainId) as string),
      limit: rowsPerPage,
      offset: skipRows,
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
