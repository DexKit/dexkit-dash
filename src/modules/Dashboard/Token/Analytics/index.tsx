import Skeleton from '@material-ui/lab/Skeleton/Skeleton';
import {useTokenAnalytics} from 'hooks/token/useTokenAnalytics';
import React from 'react';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import ErrorView from 'modules/Common/ErrorView';

import {Box, makeStyles, Grid, Typography} from '@material-ui/core';
import {CremaTheme} from 'types/AppContextPropsType';
import {useSingleBalance} from 'hooks/balance/useSingleBalance';
import {useTokenPriceUSD} from 'hooks/useTokenPriceUSD';
import {OrderSide} from 'types/app';


import {ReactComponent as ConnectivityImage} from 'assets/images/state/connectivity-04.svg';
import AnalyticsAmountCard from 'shared/components/AnalyticsAmountCard';

type Field =
  | 'amountBuySpentUSD'
  | 'amountSellSpentUSD'
  | 'tradeProfitUSD'
  | 'gasValueSpentUSD'
  | 'averageBuyPrice'
  | 'averageSellPrice'
  | 'totalTx';

const properties: {
  field: Field;
  label: string;
  isUSD: boolean;
  tooltip: string;
}[] = [
  {
    field: 'amountBuySpentUSD',
    label: 'Total Buys (USD)',
    isUSD: true,
    tooltip: 'Total buys of this currency in USD',
  },
  {
    field: 'amountSellSpentUSD',
    label: 'Total Sells (USD)',
    isUSD: true,
    tooltip: 'Total sells of this currency in USD',
  },
  {
    field: 'tradeProfitUSD',
    label: 'Sells minus Buys (USD)',
    isUSD: true,
    tooltip: 'Difference between the buys and sells in USD',
  },
  {
    field: 'gasValueSpentUSD',
    label: 'Total Spent in Gas (USD)',
    isUSD: true,
    tooltip: 'Gas spent in all transfers involved this currency trades',
  },
  {
    field: 'averageBuyPrice',
    label: 'Average Buy Price',
    isUSD: true,
    tooltip: 'Average buy price across all trades',
  },
  {
    field: 'averageSellPrice',
    label: 'Average Sell Price',
    isUSD: true,
    tooltip: 'Average sell price across all trades',
  },
  {
    field: 'totalTx',
    label: 'Total Tx',
    isUSD: false,
    tooltip: 'Total trades',
  },
];

interface Props {
  account: string;
  token: string;
  networkName: EthereumNetwork;
}

const useStyles = makeStyles((theme: CremaTheme) => ({
  listLayout: {
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
    },
  },
  subList: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      padding: '0px',
    },
  },
  analyticsContainer: {
    display: 'flex',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    touchAction: 'auto',
    overflowX: 'scroll',
    '&::-webkit-scrollbar': {
      width: '0px !important',
    },
  },
  analyticsItem: {
    marginRight: theme.spacing(4),
    display: 'inline-block',
  },
}));

export const TokenAnalytics = (props: Props) => {
  const {account, token, networkName} = props;
  const classes = useStyles();

  const {data, loading, error} = useTokenAnalytics(account, token, networkName);
  const {data: tokenBalance} = useSingleBalance(token, networkName, account);
  const {priceQuote} = useTokenPriceUSD(
    token,
    networkName,
    OrderSide.Buy,
    1,
    tokenBalance?.currency?.decimals,
  );

  const priceUSD = priceQuote?.price;
  const profitLoss =
    (tokenBalance?.value || 0) * Number(priceUSD || 0) -
    ((data?.amountBuySpentUSD || 0) - (data?.amountSellSpentUSD || 0));
  const balanceUSD = (tokenBalance?.value || 0) * Number(priceUSD || 0);

  // loading
  // error

  return error || !data ? null : (
    <Box>
      {error ? <ErrorView message={'Error fetching analytics'} /> : null}
      {loading ? <Skeleton variant='rect' height={100} /> : null}
      {data ? (
        <Box className={classes.analyticsContainer}>
          <Box className={classes.analyticsItem}>
            <AnalyticsAmountCard
              amount={balanceUSD}
              caption='Balance (USD)'
              icon={<></>}
            />
          </Box>
          <Box className={classes.analyticsItem}>
            <AnalyticsAmountCard
              amount={profitLoss}
              caption='Profit/Loss'
              icon={<></>}
              colorsEnabled
            />
          </Box>
          {properties.map((p, index: number) => (
            <Box key={index} className={classes.analyticsItem}>
              <AnalyticsAmountCard
                amount={
                  p.field.toString() === 'totalTx'
                    ? p.isUSD
                      ? String(data[p.field])
                      : String(data[p.field])
                    : p.isUSD
                    ? data[p.field]
                    : data[p.field]
                }
                caption={p.label}
                icon={<></>}
              />
            </Box>
          ))}
        </Box>
      ) : null}
      {!data ? (
        <Grid
          container
          alignItems='center'
          alignContent='center'
          justify='center'
          direction='column'
          spacing={2}>
          <Grid item xs={12}>
            <ConnectivityImage />
          </Grid>
          <Grid item xs={12}>
            <Typography
              style={{textTransform: 'uppercase'}}
              gutterBottom
              align='center'
              variant='h5'>
              Ops, no data
            </Typography>
            <Typography align='center'>
              No trade analytics available for this account, start trading.
            </Typography>
          </Grid>
        </Grid>
      ) : null}
    </Box>
  );
};
