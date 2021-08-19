import {useEffect, useState} from 'react';
import useFetch from 'use-http';
import {useChainId} from '../useChainId';
import {useTokenList} from 'hooks/useTokenList';
import usePagination from 'hooks/usePagination';
import {ZRX_API_URL} from 'shared/constants/AppConst';
import {toTokenUnitAmount} from '@0x/utils';
import {GET_NETWORK_NAME} from 'shared/constants/Bitquery';

interface Props {
  address: string;
}

export const useMyOrdersHistory = ({address}: Props) => {
  const {currentChainId} = useChainId();
  const tokenList = useTokenList(GET_NETWORK_NAME(currentChainId));

  const {
    currentPage,
    rowsPerPage,
    rowsPerPageOptions,
    onChangePage,
    onChangeRowsPerPage,
  } = usePagination();

  const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState<number>(0);

  const {loading, error, data: dataFn} = useFetch(
    `${ZRX_API_URL(currentChainId)}/sra/v4/orders?page=${
      currentPage + 1
    }&perPage=${rowsPerPage}?trader=${address}`,
    [address, currentPage, rowsPerPage],
  );

  console.log(data.length);

  useEffect(() => {
    if (dataFn && dataFn?.records) {
      const newData = dataFn.records.map((e: any) => {
        e.order['makerAmountFn'] = toTokenUnitAmount(
          e.order.makerAmount,
          tokenList.find((t) => t.address === e.order.makerToken)?.decimals ||
            18,
        ).toString();
        e.order['takerAmountFn'] = toTokenUnitAmount(
          e.order.takerAmount,
          tokenList.find((t) => t.address === e.order.takerToken)?.decimals ||
            18,
        ).toString();
        e.metaData['remainingFillableTakerAmountFn'] = toTokenUnitAmount(
          e.metaData.remainingFillableTakerAmount,
          tokenList.find((t) => t.address === e.order.takerToken)?.decimals ||
            18,
        ).toString();
        return e;
      });

      setData(
        newData.sort((a: any, b: any) => a?.order.expiry - b?.order.expiry),
      );
      setTotalRows(dataFn.total);
    } else {
      setData([]);
      setTotalRows(0);
    }
  }, [dataFn, tokenList]);

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
