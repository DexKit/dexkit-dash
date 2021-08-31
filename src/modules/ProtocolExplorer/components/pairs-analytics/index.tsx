import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React, { useMemo } from 'react';
import AnalyticsAmountCard from 'shared/components/AnalyticsAmountCard';

import {ReactComponent as PresentationChartIcon} from 'assets/images/icons/presentation-chart.svg';
import {ReactComponent as GraphIcon} from 'assets/images/icons/graph.svg';
import {ReactComponent as ChartSuccessIcon} from 'assets/images/icons/chart-success.svg';
import { usePairExplorer } from 'hooks/protocolExplorer/usePairExplorer';
import {GetTokenPairs_ethereum_dexTrades} from 'services/graphql/bitquery/protocol/__generated__/GetTokenPairs';
import { EthereumNetwork, EXCHANGE } from 'shared/constants/AppEnums';
import { useUSDFormatter } from 'hooks/utils/useUSDFormatter';

type Props = {
  exchange: EXCHANGE;
  networkName: EthereumNetwork;
  pair: GetTokenPairs_ethereum_dexTrades;
};
export const PairAnalytics = (props: Props) => {
  const {exchange, networkName, pair} = props;

  const {loading, error, data} = usePairExplorer({
    baseAddress: pair.baseCurrency?.address as string,
    quoteAddress: pair.quoteCurrency?.address as string,
    exchange,
    networkName,
  });

  const {usdFormatter} = useUSDFormatter();
  const tradeAmountInUSD = useMemo(() => {
    return loading ? '-' : usdFormatter.format(data?.tradeAmountInUsd|| 0);
  }, [data?.tradeAmountInUsd, loading]);


  return (
    <Grid container alignItems='center' spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h6'>Pair Analytics</Typography>
      </Grid>

      <Grid item>
        <Grid container justifyContent='center' spacing={4}>
          <Grid key={1} item>
            <AnalyticsAmountCard
              icon={<ChartSuccessIcon />}
              isLoading={loading}
              amount={tradeAmountInUSD}
              caption={'Daily Volume'}
            />
          </Grid>
          <Grid key={2} item>
            <AnalyticsAmountCard
              icon={<GraphIcon />}
              isLoading={loading}
              amount={loading ? '-' : data?.trades ? String(data?.trades) : '-'}
              caption={'Total Trades (24h)'}
            />
          </Grid>
          <Grid key={3} item>
            <AnalyticsAmountCard
              icon={<PresentationChartIcon />}
              isLoading={loading}
              amount={data?.baseAmount.toFixed(4) || '-'}
              caption={`Amount ${pair.baseCurrency?.symbol} (24h)`}
            />
          </Grid>
          <Grid key={4} item>
            <AnalyticsAmountCard
              isLoading={loading}
              icon={<PresentationChartIcon />}
              amount={data?.quoteAmount.toFixed(4) || '-'}
              caption={`Amount ${pair.quoteCurrency?.symbol} (24h)`}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
