import React, {useMemo} from 'react';

import {useIntl} from 'react-intl';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
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
import {Box, makeStyles} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),

    [theme.breakpoints.down('sm')]: {
      overflowY: 'hidden',
      overflowX: 'scroll',
      flexWrap: 'nowrap',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
  },
  item: {
    marginRight: theme.spacing(4),
    objectFit: 'contain',
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

  const {messages} = useIntl();

  const volumeUSD = useMemo(() => {
    return loading ? '-' : usdFormatter.format(data?.volume24InUsd || 0);
  }, [data?.volume24InUsd, loading]);

  const liquidity = useMemo(() => {
    return loading ? '-' : usdFormatter.format(data?.liquidity || 0);
  }, [data?.liquidity, loading]);

  return (
    <Grid container alignItems='center' spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h6'>{messages['app.pairAnalytics']}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Box className={classes.container}>
          <Box className={classes.item}>
            <AnalyticsAmountCard
              isLoading={loading}
              icon={<ChartSuccessIcon />}
              amount={volumeUSD}
              caption={messages['app.dailyVolume'] as string}
            />
          </Box>
          <Box className={classes.item}>
            <AnalyticsAmountCard
              isLoading={loading}
              icon={<HashtagIcon />}
              amount={liquidity}
              caption={messages['app.totalLiquidy'] as string}
            />
          </Box>
          <Box className={classes.item}>
            <AnalyticsAmountCard
              isLoading={loading}
              icon={<PresentationChartIcon />}
              amount={data?.baseAmount.toFixed(4) || '-'}
              caption={`${messages['app.amount']} ${pair.baseCurrency?.symbol} (${messages['app.24Hrs']})`}
            />
          </Box>
          <Box className={classes.item}>
            <AnalyticsAmountCard
              isLoading={loading}
              icon={<PresentationChartIcon />}
              amount={data?.quoteAmount.toFixed(4) || '-'}
              caption={`${messages['app.amount']} ${pair.quoteCurrency?.symbol} (${messages['app.24Hrs']})`}
            />
          </Box>
          <Box className={classes.item}>
            <AnalyticsAmountCard
              isLoading={loading}
              icon={<StatusUpIcon />}
              amount={data?.basePooled.toFixed(4) || '-'}
              caption={`${messages['app.pooled']} ${pair.baseCurrency?.symbol} (${messages['app.24Hrs']})`}
            />
          </Box>
          <Box className={classes.item}>
            <AnalyticsAmountCard
              isLoading={loading}
              icon={<StatusUpIcon />}
              amount={data?.quotePooled.toFixed(4) || '-'}
              caption={`${messages['app.pooled']} ${pair.quoteCurrency?.symbol} (${messages['app.24Hrs']})`}
            />
          </Box>
          <Box className={classes.item}>
            <AnalyticsAmountCard
              isLoading={loading}
              icon={<GraphIcon />}
              amount={loading ? '-' : data?.trades ? String(data?.trades) : '-'}
              caption={messages['app.dailyTrades'] as string}
            />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};
