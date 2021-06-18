import {useContext, useEffect, useState} from 'react';
import {useQuery} from '@apollo/client';
import usePagination from 'hooks/usePagination';
import {
  GetContractOrders,
  GetContractOrdersVariables,
  GetContractOrders_ethereum_dexTrades,
} from 'services/graphql/bitquery/protocol/__generated__/GetContractOrders';
import {extractPairFromAddress, getFilterValueById} from 'utils';
import {POLL_INTERVAL} from 'shared/constants/AppConst';
import {GET_EXCHANGE_NAME} from 'shared/constants/Bitquery';
import {GET_CHAIN_FROM_NETWORK, GET_DEFAULT_QUOTE} from 'shared/constants/Blockchain';
import {EthereumNetwork, EXCHANGE} from 'shared/constants/AppEnums';
import {BITQUERY_CONTRACT_ORDERS} from 'services/graphql/bitquery/protocol/amm.gql';
import { FilterContext } from 'providers/protocol/filterContext';

interface Props {
  networkName: EthereumNetwork;
  exchange: EXCHANGE;
  address: string;
}
export const useAMMPairTrades = ({networkName, exchange, address}: Props) => {
  const chainId =  GET_CHAIN_FROM_NETWORK(networkName);

  const {quoteAddress} = extractPairFromAddress(address, chainId);
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

  const [data, setData] = useState<GetContractOrders_ethereum_dexTrades[]>();

  const {loading, error, data: dataFn} = useQuery<
    GetContractOrders,
    GetContractOrdersVariables
  >(BITQUERY_CONTRACT_ORDERS, {
    variables: {
      network: networkName,
      exchangeName: GET_EXCHANGE_NAME(exchange),
      address: address,
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
      const dexTrades: GetContractOrders_ethereum_dexTrades[] =
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
  };
};
