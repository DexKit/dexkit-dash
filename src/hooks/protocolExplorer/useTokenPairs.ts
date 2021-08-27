import {useEffect, useState} from 'react';
import {useQuery} from '@apollo/client';
import {useChainId} from '../useChainId';
import usePagination from 'hooks/usePagination';
import {
  GetTokenPairs,
  GetTokenPairsVariables,
  GetTokenPairs_ethereum_dexTrades,
} from 'services/graphql/bitquery/protocol/__generated__/GetTokenPairs';
import {BITQUERY_TOKEN_PAIRS} from 'services/graphql/bitquery/protocol/gql';
import {POLL_INTERVAL} from 'shared/constants/AppConst';
import {GET_EXCHANGE_NAME} from 'shared/constants/Bitquery';
import {EXCHANGE} from 'shared/constants/AppEnums';
import {EthereumNetwork} from '../../../__generated__/globalTypes';
import {getLast24HoursDate} from 'utils/time_utils';

interface Props {
  networkName: EthereumNetwork;
  baseAddress: string;
  exchange: EXCHANGE;
}
export const useTokenPairs = ({baseAddress, exchange, networkName}: Props) => {
  const {
    currentPage,
    rowsPerPage,
    // skipRows,
    rowsPerPageOptions,
    onChangePage,
    onChangeRowsPerPage,
  } = usePagination();

  const [data, setData] = useState<
    GetTokenPairs_ethereum_dexTrades[]
  >();
  const [yesterday, setYesterday] = useState<Date>(getLast24HoursDate());

  const {loading, error, data: dataFn} = useQuery<
    GetTokenPairs,
    GetTokenPairsVariables
  >(BITQUERY_TOKEN_PAIRS, {
    variables: {
      network: networkName,
      exchangeName:
        exchange == EXCHANGE.ALL ? undefined : GET_EXCHANGE_NAME(exchange),
      baseAddress: baseAddress,
      limit: rowsPerPage,
      from: yesterday,
    },
    pollInterval: POLL_INTERVAL,
  });

  useEffect(() => {
    if (dataFn && dataFn?.ethereum?.dexTrades) {
      const dexTrades: any[] = [...dataFn.ethereum?.dexTrades] || [];

      const newData = dexTrades
        .map((e) => {
          const j = {...e};

          const quotePerDolar =
            (j.quoteAmountInUsd || 0) / (j.quoteAmount || 1);

          j['closePriceUsd'] = (j.closePrice || 0) * quotePerDolar;
          j['priceUsd'] = (j.quotePrice || 0) * quotePerDolar;
          j['volume24'] = j.tradeAmount;
          j['volume24InUsd'] = j.tradeAmountInUsd;
          j['quoteVolume24'] = j.quoteAmount;
          j['baseVolume24'] = j.baseAmount;

          return j;
        })
        .sort(
          (a, b) => (b?.tradeAmountInUsd || 0) - (a?.tradeAmountInUsd || 0),
        );

      // const newData = dexTrades
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
