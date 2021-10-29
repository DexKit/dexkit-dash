import React, {useMemo} from 'react';

import {useIntl} from 'react-intl';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import AnalyticsAmountCard from 'shared/components/AnalyticsAmountCard';

import {Box, makeStyles, useMediaQuery, useTheme} from '@material-ui/core';

import {ReactComponent as PresentationChartIcon} from 'assets/images/icons/presentation-chart.svg';
import {ReactComponent as GraphIcon} from 'assets/images/icons/graph.svg';
import {ReactComponent as ChartSuccessIcon} from 'assets/images/icons/chart-success.svg';
import {Token} from 'types/app';
import {useUSDFormatter} from 'hooks/utils/useUSDFormatter';

type TokenMarket = {
  volume24Usd: number;
  volume24Base: number;
  trades: number;
};

type Props = {
  tokenMarket?: TokenMarket;
  token?: Token;
  priceUSD?: string;
  loading: boolean;
};

const useStyles = makeStyles((theme) => ({
  container: {
    justifyContent: 'flex-start',
    display: 'flex',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    overflowY: 'hidden',
    overflowX: 'scroll',
    flexWrap: 'nowrap',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
}));

export const Analytics = (props: Props) => {
  const {tokenMarket, token, loading, priceUSD} = props;
  const {usdFormatter} = useUSDFormatter();
  const volumeUSD = useMemo(() => {
    return loading
      ? '-'
      : tokenMarket?.volume24Usd
      ? usdFormatter.format(tokenMarket?.volume24Usd || 0)
      : priceUSD
      ? usdFormatter.format(
          (tokenMarket?.volume24Base || 0) * Number(priceUSD || 0),
        )
      : '-';
  }, [tokenMarket?.volume24Usd, tokenMarket?.volume24Base, loading, priceUSD]);

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const classes = useStyles();

  const {messages} = useIntl();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h6'>{messages['app.overallAnalytics']}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Box className={classes.container}>
          <Grid container spacing={4} wrap={isMobile ? 'nowrap' : undefined}>
            <Grid item xs={isMobile ? true : undefined} sm={6}>
              <AnalyticsAmountCard
                isLoading={loading}
                icon={<ChartSuccessIcon />}
                amount={volumeUSD || '-'}
                caption={messages['app.dailyVolume'] as string}
              />
            </Grid>
            <Grid item xs={isMobile ? true : undefined} sm={6}>
              <AnalyticsAmountCard
                isLoading={loading}
                icon={<GraphIcon />}
                amount={loading ? '-' : tokenMarket?.trades || '-'}
                caption={messages['app.dailyTrades'] as string}
                notUsdValue
              />
            </Grid>
            <Grid item xs={isMobile ? true : undefined} sm={6}>
              <AnalyticsAmountCard
                isLoading={loading}
                icon={<PresentationChartIcon />}
                amount={
                  loading ? '-' : tokenMarket?.volume24Base.toFixed(2) || '-'
                }
                caption={`${messages['app.amount']} ${
                  token ? token.symbol?.toUpperCase() : ''
                } (${messages['app.24Hrs']})`}
                notUsdValue
              />
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};
