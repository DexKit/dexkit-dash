import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import AnalyticsAmountCard from 'shared/components/AnalyticsAmountCard';

import {ReactComponent as PresentationChartIcon} from 'assets/images/icons/presentation-chart.svg';
import {ReactComponent as GraphIcon} from 'assets/images/icons/graph.svg';
import {ReactComponent as ChartSuccessIcon} from 'assets/images/icons/chart-success.svg';

export const PairAnalytics = () => {
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
              amount={0}
              caption={'Daily Volume'}
            />
          </Grid>
          <Grid key={2} item>
            <AnalyticsAmountCard
              icon={<GraphIcon />}
              amount={0}
              caption={'Total Trades (24h)'}
            />
          </Grid>
          <Grid key={3} item>
            <AnalyticsAmountCard
              icon={<PresentationChartIcon />}
              amount={0}
              caption={'Amount ZRX (24h)'}
            />
          </Grid>
          <Grid key={4} item>
            <AnalyticsAmountCard
              icon={<PresentationChartIcon />}
              amount={0}
              caption={'Amount KIT (24h)'}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
