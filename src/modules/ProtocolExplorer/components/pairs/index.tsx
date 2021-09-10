import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React, {useState, useEffect} from 'react';

import {PairAnalytics} from '../pairs-analytics';
import {EthereumNetwork, EXCHANGE} from 'shared/constants/AppEnums';
import {useTokenPairs} from 'hooks/protocolExplorer/useTokenPairs';
import {GetTokenPairs_ethereum_dexTrades} from 'services/graphql/bitquery/protocol/__generated__/GetTokenPairs';
import Skeleton from '@material-ui/lab/Skeleton';
import Paper from '@material-ui/core/Paper';
import {useStyles} from './index.style';
import HistoryTables from '../history';
import Box from '@material-ui/core/Box';
import {IS_AMM} from 'utils';
import {PairAnalyticsAMM} from '../pairs-analytics-amm';
import TokenPairCard, {TokenPairIcon} from 'shared/components/TokenPairCard';
import {useMediaQuery, useTheme} from '@material-ui/core';
type Props = {
  baseAddress: string;
  exchange: EXCHANGE;
  networkName: EthereumNetwork;
};

type PairItem = {
  onClick: any;
  loading: boolean;
  item: GetTokenPairs_ethereum_dexTrades;
};

const PairItem = (props: PairItem) => {
  const {loading, item, onClick} = props;
  return loading ? (
    <Skeleton variant='rect' height={370} />
  ) : (
    <Paper>
      <p onClick={onClick}>
        {' '}
        {item.baseCurrency?.symbol.toUpperCase()}/
        {item.quoteCurrency?.symbol.toUpperCase()} {item.exchange?.fullName}
      </p>
    </Paper>
  );
};

export const Pairs = (props: Props) => {
  const {baseAddress, exchange, networkName} = props;
  const [selectedPair, setSelectedPair] =
    useState<GetTokenPairs_ethereum_dexTrades>();
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
  const classes = useStyles();

  useEffect(() => {
    if (!selectedPair && data && data.length) {
      setSelectedPair(data[0]);
    }
  }, [data]);

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Grid container alignItems='center' spacing={4}>
        <Grid item xs={12}>
          <Typography variant='h6'>{data ? data.length : ''} Pairs</Typography>
        </Grid>
        <Grid item xs={12}>
          <Box className={classes.container}>
            {data &&
              data?.map((pair, k) => (
                <Box className={classes.item} key={k}>
                  <TokenPairCard
                    firstToken={pair.baseCurrency?.symbol as string}
                    secondToken={pair.quoteCurrency?.symbol as string}
                    firstIcon={''}
                    secondIcon={''}
                    selected={pair === selectedPair}
                    exchange={pair.exchange?.fullName as EXCHANGE}
                    onSelect={() => setSelectedPair(pair)}
                  />
                </Box>
              ))}
          </Box>
        </Grid>
        <Grid item xs={12}>
          {selectedPair &&
          IS_AMM(
            selectedPair?.exchange?.fullName as EXCHANGE,
            selectedPair?.protocol,
          ) ? (
            <>
              <PairAnalyticsAMM
                exchange={selectedPair?.exchange?.fullName as EXCHANGE}
                address={selectedPair?.smartContract?.address.address as string}
                networkName={networkName}
                pair={selectedPair}
              />
            </>
          ) : (
            selectedPair && (
              <>
                <PairAnalytics
                  exchange={selectedPair?.exchange?.fullName as EXCHANGE}
                  networkName={networkName}
                  pair={selectedPair}
                />
              </>
            )
          )}
        </Grid>
      </Grid>
      <Box mt={2}>
        <Grid container alignItems='center' spacing={2}>
          <Grid item xs={12}>
            <HistoryTables
              address={baseAddress}
              networkName={networkName}
              pair={selectedPair}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
