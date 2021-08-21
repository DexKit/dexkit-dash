import {useQuery} from '@apollo/client';
import {useChainId} from '../useChainId';

import {BITQUERY_AMM_PAIR_EXPLORER} from 'services/graphql/bitquery/protocol/amm.gql';
import {
  GetAMMPairExplorer,
  GetAMMPairExplorerVariables,
} from 'services/graphql/bitquery/protocol/__generated__/GetAMMPairExplorer';

import {POLL_INTERVAL} from 'shared/constants/AppConst';
import {GET_EXCHANGE_NAME, GET_NETWORK_NAME} from 'shared/constants/Bitquery';
import {
  GET_CHAIN_FROM_NETWORK,
  GET_DEFAULT_QUOTE,
} from 'shared/constants/Blockchain';
import {EXCHANGE} from 'shared/constants/AppEnums';
import {useEffect, useState} from 'react';
import {EthereumNetwork} from '../../../__generated__/globalTypes';

interface Props {
  networkName: EthereumNetwork;
  address: string;
  exchange: EXCHANGE;
}

export const useAMMPairExplorer = ({exchange, address, networkName}: Props) => {
  const chainId = GET_CHAIN_FROM_NETWORK(networkName);
  const [data, setData] = useState<any>();
  const {loading, error, data: dataFn} = useQuery<
    GetAMMPairExplorer,
    GetAMMPairExplorerVariables
  >(BITQUERY_AMM_PAIR_EXPLORER, {
    variables: {
      network: networkName,
      exchangeName:
        exchange == EXCHANGE.ALL ? undefined : GET_EXCHANGE_NAME(exchange),
      pairAddress: address,
      quoteAddress: GET_DEFAULT_QUOTE(chainId) as string,
    },
    pollInterval: POLL_INTERVAL,
  });

  useEffect(() => {
    if (
      dataFn &&
      dataFn?.ethereum?.dexTrades &&
      dataFn?.ethereum?.dexTrades.length > 1
    ) {
      const d24Current: any = {...dataFn?.ethereum?.dexTrades[0]};
      const d24Yesterday = dataFn?.ethereum?.dexTrades[1];

      const pooled = dataFn?.ethereum?.pooled[0].balances || [];

      const basePerDolar =
        (d24Current.baseAmountInUsd || 0) / (d24Current.baseAmount || 1);
      const quotePerDolar =
        (d24Current.quoteAmountInUsd || 0) / (d24Current.quoteAmount || 1);

      const basePooled =
        pooled.find(
          (e: any) => e.currency.symbol === d24Current.baseCurrency?.symbol,
        )?.value || 0;
      const quotePooled =
        pooled.find(
          (e: any) => e.currency.symbol === d24Current.quoteCurrency?.symbol,
        )?.value || 0;

      d24Current['price'] = Number(d24Current.close_price);
      d24Current['priceUsd'] = Number(d24Current.close_price) * quotePerDolar;
      d24Current['priceChange'] =
        (Number(d24Current.close_price) * 100) /
          Number(d24Yesterday.close_price) -
        100;
      d24Current['liquidity'] =
        basePooled * basePerDolar + quotePooled * quotePerDolar;
      d24Current['volume24'] = d24Current.tradeAmount;
      d24Current['volume24InUsd'] = d24Current.tradeAmountInUsd;
      d24Current['basePooled'] = basePooled;
      d24Current['quotePooled'] = quotePooled;

      // const newData = dexTrades
      setData(d24Current);
    } else {
      setData(undefined);
    }
  }, [dataFn]);

  return {loading, error, data};
};
