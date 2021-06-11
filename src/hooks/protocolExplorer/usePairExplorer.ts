import {useQuery} from '@apollo/client';

import {BITQUERY_PAIR_EXPLORER} from 'services/graphql/bitquery/protocol/gql';
import { GetPairExplorer, GetPairExplorerVariables, GetPairExplorer_ethereum_dexTrades } from 'services/graphql/bitquery/protocol/__generated__/GetPairExplorer';

import {POLL_INTERVAL} from 'shared/constants/AppConst';
import {GET_EXCHANGE_NAME} from 'shared/constants/Bitquery';
import {GET_CHAIN_FROM_NETWORK, GET_DEFAULT_QUOTE} from 'shared/constants/Blockchain';
import {EXCHANGE} from 'shared/constants/AppEnums';
import { useEffect, useState } from 'react';
import { EthereumNetwork } from '../../../__generated__/globalTypes';

interface Props {
  baseAddress: string;
  quoteAddress: string | null;
  networkName: EthereumNetwork;
  exchange: EXCHANGE;
}

export const usePairExplorer = ({
  exchange,
  baseAddress,
  quoteAddress,
  networkName,
}: Props) => {
  const chainId = GET_CHAIN_FROM_NETWORK(networkName);
  const [data, setData] = useState<GetPairExplorer_ethereum_dexTrades | any>();
  const [yesterday, setYesterday] = useState<Date>(new Date(new Date().getTime() - 24 * 3600 * 1000));

  const {loading, error, data: dataFn} = useQuery<GetPairExplorer, GetPairExplorerVariables>(BITQUERY_PAIR_EXPLORER, {
    variables: {
      network: networkName,
      exchangeName: exchange == EXCHANGE.ALL ? undefined : GET_EXCHANGE_NAME(exchange),
      baseAddress: baseAddress,
      quoteAddress: quoteAddress || (GET_DEFAULT_QUOTE(chainId) as string),
      from: yesterday
    },
    pollInterval: POLL_INTERVAL,
  });

  useEffect(() => {
    if (dataFn && dataFn?.ethereum?.dexTrades && dataFn?.ethereum?.dexTrades.length > 0) {
      let d: any = {...dataFn.ethereum?.dexTrades[0]};
      
      const quotePerDolar = d.quoteAmountInUsd / d.quoteAmount;
      const priceChange = Number(d.open_price) !== 0 ? (Number(d.close_price) - Number(d.open_price))/ (Number(d.open_price)) : 0;

      d['price'] = Number(d.close_price);
      d['priceUsd'] = (Number(d.close_price) * quotePerDolar);
      d['priceChange'] = priceChange;

      console.log(d);

      // const newData = dexTrades
      setData(d);
    } else {
      setData(undefined);
    }
  }, [dataFn]);

  return {loading, error, data};
};
