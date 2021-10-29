import React, {useMemo} from 'react';

import {useIntl} from 'react-intl';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import AnalyticsAmountCard from 'shared/components/AnalyticsAmountCard';
import {Box, makeStyles} from '@material-ui/core';
import {ReactComponent as PresentationChartIcon} from 'assets/images/icons/presentation-chart.svg';
import {ReactComponent as GraphIcon} from 'assets/images/icons/graph.svg';
import {ReactComponent as ChartSuccessIcon} from 'assets/images/icons/chart-success.svg';
import {EthereumNetwork, EXCHANGE} from 'shared/constants/AppEnums';
import {useUSDFormatter} from 'hooks/utils/useUSDFormatter';
import {MoneyReciveIcon, MoneySendIcon} from 'shared/components/Icons';

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
  icon: {
    '& > path': {
      stroke: '#FFA552',
    },
  },
}));

type Props = {
  exchange: EXCHANGE;
  networkName: EthereumNetwork;
  pair: any;
  // pair: GetTokenPairs_ethereum_dexTrades;
};

export const PairAnalytics = (props: Props) => {
  const {exchange, networkName, pair} = props;
  const loading = false;

  /*const {loading, error, data} = usePairExplorer({
    baseAddress: pair.baseCurrency?.address as string,
    quoteAddress: pair.quoteCurrency?.address as string,
    exchange,
    networkName,
  });*/

  const {usdFormatter} = useUSDFormatter();

  const classes = useStyles();

  const {messages} = useIntl();

  const tradeAmountInUSD = useMemo(() => {
    return usdFormatter.format(pair?.tradeAmountInUsd || 0);
  }, [pair?.tradeAmountInUsd]);

  const lastPriceInUSD = useMemo(() => {
    return usdFormatter.format(Number(pair?.closePriceUsd || 0));
  }, [pair?.closePriceUsd]);

  const maxPriceInUSD = useMemo(() => {
    return usdFormatter.format(pair?.maxPriceUsd || 0);
  }, [pair?.maximumPrice]);

  const minPriceInUSD = useMemo(() => {
    return usdFormatter.format(pair?.minPriceUsd || 0);
  }, [pair?.minPriceUsd]);

  return (
    <Grid container alignItems='center' spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h6'> {messages['app.pairAnalytics']}</Typography>
      </Grid>

      <Grid item>
        <Box className={classes.container}>
          <Box className={classes.item}>
            <AnalyticsAmountCard
              icon={<ChartSuccessIcon />}
              isLoading={loading}
              amount={tradeAmountInUSD}
              caption={messages['app.dailyVolume'] as string}
            />
          </Box>
          '
          <Box className={classes.item}>
            <AnalyticsAmountCard
              icon={<GraphIcon />}
              isLoading={loading}
              amount={lastPriceInUSD}
              caption={messages['app.lastPrice'] as string}
            />
          </Box>
          <Box className={classes.item}>
            <AnalyticsAmountCard
              icon={<MoneySendIcon className={classes.icon} />}
              isLoading={loading}
              amount={maxPriceInUSD}
              caption={messages['app.maxPrice'] as string}
            />
          </Box>
          <Box className={classes.item}>
            <AnalyticsAmountCard
              icon={<MoneyReciveIcon className={classes.icon} />}
              isLoading={loading}
              amount={minPriceInUSD}
              caption={messages['app.minPrice'] as string}
            />
          </Box>
          <Box className={classes.item}>
            <AnalyticsAmountCard
              icon={<GraphIcon />}
              isLoading={loading}
              amount={loading ? '-' : pair?.trades ? String(pair?.trades) : '-'}
              caption={messages['app.totalDailyTrades'] as string}
            />
          </Box>
          <Box className={classes.item}>
            <AnalyticsAmountCard
              icon={<PresentationChartIcon />}
              isLoading={loading}
              amount={pair?.baseAmount?.toFixed(4) || '-'}
              caption={`${messages['app.amount']} ${pair.baseCurrency?.symbol} (${messages['app.24Hrs']})`}
            />
          </Box>
          <Box className={classes.item}>
            <AnalyticsAmountCard
              isLoading={loading}
              icon={<PresentationChartIcon />}
              amount={pair?.quoteAmount?.toFixed(4) || '-'}
              caption={`${messages['app.amount']} ${pair.quoteCurrency?.symbol} (${messages['app.24Hrs']})`}
            />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};
