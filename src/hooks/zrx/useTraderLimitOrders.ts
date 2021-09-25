import {toTokenUnitAmount} from '@0x/utils';
import {useChainId} from 'hooks/useChainId';
import {useTokenList} from 'hooks/useTokenList';
import {useMemo} from 'react';
import {useQuery} from 'react-query';
import {ZRX_API_URL_FROM_NETWORK} from 'shared/constants/AppConst';
import {EthereumNetwork} from 'shared/constants/AppEnums';

export const useTraderLimitOrders = (
  rowsPerPage = 10,
  currentPage = 0,
  networkName: EthereumNetwork,
  account?: string,
) => {
  const tokenList = useTokenList(networkName);
  const {currentChainId} = useChainId();

  const ordersQuery = useQuery(
    ['GetZRXTraderOrders', account, rowsPerPage, currentPage],
    () => {
      if (account) {
        const url = `${ZRX_API_URL_FROM_NETWORK(
          networkName,
          currentChainId,
        )}/sra/v4/orders?page=${
          currentPage + 1
        }&perPage=${rowsPerPage}&trader=${account?.toLowerCase()}`;
        return fetch(url).then((r) => r.json());
      }
    },
  );

  const parsedOrders = useMemo(() => {
    if (
      tokenList &&
      tokenList.length &&
      ordersQuery.data &&
      ordersQuery.data?.records
    ) {
      return ordersQuery.data.records.map((e: any) => {
        const makerToken = tokenList.find(
          (t: any) =>
            t.address.toLowerCase() === e.order.makerToken.toLowerCase(),
        );
        const takerToken = tokenList.find(
          (t: any) =>
            t.address.toLowerCase() === e.order.takerToken.toLowerCase(),
        );

        e.order['makerTokenFn'] = makerToken;
        e.order['takerTokenFn'] = takerToken;
        e.order['makerAmountFn'] = toTokenUnitAmount(
          e.order.makerAmount,
          makerToken?.decimals || 18,
        ).toString();
        e.order['takerAmountFn'] = toTokenUnitAmount(
          e.order.takerAmount,
          takerToken?.decimals || 18,
        ).toString();
        e.metaData['remainingFillableTakerAmountFn'] = toTokenUnitAmount(
          e.metaData.remainingFillableTakerAmount,
          takerToken?.decimals || 18,
        ).toString();

        return e;
      });
    }
  }, [ordersQuery.data, tokenList]);

  const totalOrders = useMemo(() => {
    if (ordersQuery.data?.total) {
      return ordersQuery.data?.total;
    }
  }, [ordersQuery.data]);

  return {
    totalOrders,
    parsedOrders,
    refetch: ordersQuery.refetch,
  };
};
