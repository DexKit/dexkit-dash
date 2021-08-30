import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React, {useMemo} from 'react';
import AnalyticsAmountCard from 'shared/components/AnalyticsAmountCard';
import {GetTokenPairs_ethereum_dexTrades} from 'services/graphql/bitquery/protocol/__generated__/GetTokenPairs';
import {ReactComponent as PresentationChartIcon} from 'assets/images/icons/presentation-chart.svg';
import {ReactComponent as GraphIcon} from 'assets/images/icons/graph.svg';
import {ReactComponent as ChartSuccessIcon} from 'assets/images/icons/chart-success.svg';
import {ReactComponent as StatusUpIcon} from 'assets/images/icons/status-up.svg';
import {ReactComponent as HashtagIcon} from 'assets/images/icons/hashtag.svg';
import {useAMMPairExplorer} from 'hooks/protocolExplorer/useAMMPairExplorer';
import {EthereumNetwork, EXCHANGE} from 'shared/constants/AppEnums';
import {useUSDFormatter} from 'hooks/utils/useUSDFormatter';
import {Box, useMediaQuery, makeStyles} from '@material-ui/core';
import {useMobile} from 'hooks/useMobile';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    overflowX: 'scroll',
  },
  item: {
    padding: theme.spacing(2),
  },
}));

type Props = {
  exchange: EXCHANGE;
  address: string;
  networkName: EthereumNetwork;
  pair: GetTokenPairs_ethereum_dexTrades;
};

export const PairAnalyticsAMM = (props: Props) => {
  const {exchange, address, networkName, pair} = props;

  const classes = useStyles();

  const {loading, error, data} = useAMMPairExplorer({
    exchange,
    address,
    networkName,
  });

  const {usdFormatter} = useUSDFormatter();

  const volumeUSD = useMemo(() => {
    return loading ? '-' : usdFormatter.format(data?.volume24InUsd || 0);
  }, [data?.volume24InUsd, loading]);

  const liquidity = useMemo(() => {
    return loading ? '-' : usdFormatter.format(data?.liquidity || 0);
  }, [data?.liquidity, loading]);

  const isMobile = useMobile();

  return (
    <Grid container alignItems='center' spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h6'>Pair Analytics</Typography>
      </Grid>
      <Grid item xs={12}>
        <Box className={classes.container}>
          <Box className={classes.item}>
            <AnalyticsAmountCard
              isLoading={loading}
              icon={<ChartSuccessIcon />}
              amount={volumeUSD}
              caption={'Daily Volume'}
            />
          </Box>
          <Box className={classes.item}>
            <AnalyticsAmountCard
              isLoading={loading}
              icon={<HashtagIcon />}
              amount={liquidity}
              caption={'Total Liquidity'}
            />
          </Box>
          <Box className={classes.item}>
            <AnalyticsAmountCard
              isLoading={loading}
              icon={<PresentationChartIcon />}
              amount={data?.baseAmount.toFixed(4) || '-'}
              caption={`Amount ${pair.baseCurrency?.symbol} (24h)`}
            />
          </Box>
          <Box className={classes.item}>
            <AnalyticsAmountCard
              isLoading={loading}
              icon={<PresentationChartIcon />}
              amount={data?.quoteAmount.toFixed(4) || '-'}
              caption={`Amount ${pair.quoteCurrency?.symbol} (24h)`}
            />
          </Box>
          <Box className={classes.item}>
            <AnalyticsAmountCard
              isLoading={loading}
              icon={<StatusUpIcon />}
              amount={data?.basePooled.toFixed(4) || '-'}
              caption={`Pooled ${pair.baseCurrency?.symbol} (24h)`}
            />
          </Box>
          <Box className={classes.item}>
            <AnalyticsAmountCard
              isLoading={loading}
              icon={<StatusUpIcon />}
              amount={data?.quotePooled.toFixed(4) || '-'}
              caption={`Pooled ${pair.quoteCurrency?.symbol} (24h)`}
            />
          </Box>
          <Box className={classes.item}>
            <AnalyticsAmountCard
              isLoading={loading}
              icon={<GraphIcon />}
              amount={data?.trades || '-'}
              caption={'Total Trades (24h)'}
            />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};
