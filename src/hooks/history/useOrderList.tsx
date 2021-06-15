import {useEffect, useState} from 'react';
import useFetch from 'use-http';
import {useTokenList} from 'hooks/useTokenList';
import usePagination from 'hooks/usePagination';
import {ZRX_API_URL} from 'shared/constants/AppConst';
import {toTokenUnitAmount} from '@0x/utils';
import { EthereumNetwork } from 'shared/constants/AppEnums';
import { GET_CHAIN_FROM_NETWORK } from 'shared/constants/Blockchain';

interface Props {
  address: string;
  networkName: EthereumNetwork;
}

export const useOrdersList = ({address, networkName}: Props) => {

  const tokenList = useTokenList(networkName);
  const currentChainId = GET_CHAIN_FROM_NETWORK(networkName);

  const {
    currentPage,
    rowsPerPage,
    rowsPerPageOptions,
    onChangePage,
    onChangeRowsPerPage,
  } = usePagination();

  const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState<number>(0);

  // Sell
  const {
    loading: sellLoading,
    error: sellError,
    data: sellData,
  } = useFetch(
    `${ZRX_API_URL(currentChainId)}/sra/v4/orders?page=${
      currentPage + 1
    }&perPage=${rowsPerPage}?makerToken=${address}`,
    [address, currentPage, rowsPerPage],
  );

  // Buy
  const {
    loading: buyLoading,
    error: buyError,
    data: buyData,
  } = useFetch(
    `${ZRX_API_URL(currentChainId)}/sra/v4/orders?page=${
      currentPage + 1
    }&perPage=${rowsPerPage}?takerToken=${address}`,
    [address, currentPage, rowsPerPage],
  );

  const loading = sellLoading && buyLoading;
  const error = sellError || buyError || null;

  useEffect(() => {
    if (sellData && sellData?.records && buyData && buyData?.records) {
      const newSellData = sellData.records.map((e: any) => {
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
        e.order['side'] = 'SELL';
        return e;
      });

      const newBuyData = buyData.records.map((e: any) => {
        console.log(e);
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
        e.order['side'] = 'BUY';
        return e;
      });

      const newData = newSellData.concat(newBuyData);

      setData(
        newData.sort((a: any, b: any) => a?.order.expiry - b?.order.expiry),
      );
      setTotalRows((sellData.total || 0) + (buyData.total || 0));
    } else {
      setData([]);
      setTotalRows(0);
    }
  }, [sellData, buyData, tokenList]);

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
