import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import AnalyticsAmountCard from 'shared/components/AnalyticsAmountCard';

import {ReactComponent as PresentationChartIcon} from 'assets/images/icons/presentation-chart.svg';
import {ReactComponent as GraphIcon} from 'assets/images/icons/graph.svg';
import {ReactComponent as ChartSuccessIcon} from 'assets/images/icons/chart-success.svg';
import {PairAnalytics} from '../pairs-analytics';
import {EthereumNetwork, EXCHANGE} from 'shared/constants/AppEnums';
import {useTokenPairs} from 'hooks/protocolExplorer/useTokenPairs';
import {GetTokenPairs_ethereum_dexTrades} from 'services/graphql/bitquery/protocol/__generated__/GetTokenPairs';
import Skeleton from '@material-ui/lab/Skeleton';
import Paper from '@material-ui/core/Paper';

type Props = {
  baseAddress: string;
  exchange: EXCHANGE;
  networkName: EthereumNetwork;
};

type PairItem = {
  loading: boolean;
  item: GetTokenPairs_ethereum_dexTrades;
};

const PairItem = (props: PairItem) => {
  const {loading, item} = props;
  return loading ? (
    <Skeleton variant='rect' height={370} />
  ) : (
    <Paper>
      <p>
        {' '}
        {item.baseCurrency?.symbol.toUpperCase()}/
        {item.quoteCurrency?.symbol.toUpperCase()} {item.exchange?.fullName}
      </p>
    </Paper>
  );
};

export const Pairs = (props: Props) => {
  const {baseAddress, exchange, networkName} = props;
  const {
    loading,
    error,
    data,
    currentPage,
    rowsPerPage,
    rowsPerPageOptions,
    onChangePage,
    onChangeRowsPerPage,
  } = useTokenPairs({exchange, baseAddress, networkName});

  return (
    <>
      <Grid container alignItems='center' spacing={2}>
        <Grid item xs={12}>
          <Typography variant='h6'>{data ? data.length : ''} Pairs</Typography>
        </Grid>
        <Grid item>
          <Grid container justifyContent='center' spacing={4}>
            {data && data?.map((i, k) => (
              <Grid key={k} item>
                {<PairItem loading={loading} item={i} />}
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
      <PairAnalytics />
    </>
  );
};
