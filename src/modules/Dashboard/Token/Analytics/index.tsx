import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Skeleton from '@material-ui/lab/Skeleton/Skeleton';
import {useTokenAnalytics} from 'hooks/token/useTokenAnalytics';
import {useUSDFormatter} from 'hooks/utils/useUSDFormatter';
import React from 'react';
import {EthereumNetwork} from 'shared/constants/AppEnums';
import ListSubheader from '@material-ui/core/ListSubheader';
import ErrorView from 'modules/Common/ErrorView';
import {
  Accordion,
  AccordionDetails,
  makeStyles,
  Tooltip,
  AccordionSummary,
  Grid,
  Typography,
} from '@material-ui/core';
import {CremaTheme} from 'types/AppContextPropsType';
import {useSingleBalance} from 'hooks/balance/useSingleBalance';
import {useTokenPriceUSD} from 'hooks/useTokenPriceUSD';
import {OrderSide} from 'types/app';
import {green, red} from '@material-ui/core/colors';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {ReactComponent as ConnectivityImage} from 'assets/images/state/connectivity-04.svg';

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
  const {usdFormatter} = useUSDFormatter();
  const colorProfitLoss = Number(profitLoss || 0) < 0 ? red[500] : green[500];

  // loading
  // error

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        Trading Analytics
      </AccordionSummary>
      <AccordionDetails style={{display: 'block'}}>
        {error ? <ErrorView message={'Error fetching analytics'} /> : null}
        {loading ? <Skeleton variant='rect' height={100} /> : null}
        {data ? (
          <List
            className={classes.listLayout}
            subheader={<ListSubheader>Trading Analytics</ListSubheader>}>
            <List className={classes.subList}>
              <Tooltip title={'Your Token Balance in USD'}>
                <ListItem> Balance (USD)</ListItem>
              </Tooltip>
              <ListItem style={{fontWeight: 'bold'}}>
                {(balanceUSD && usdFormatter.format(Number(balanceUSD))) || '-'}
              </ListItem>
            </List>
            <List className={classes.subList}>
              <Tooltip
                title={
                  'Difference between buys minus sells and your current balance value'
                }>
                <ListItem>Profit/Loss</ListItem>
              </Tooltip>
              <ListItem style={{fontWeight: 'bold', color: colorProfitLoss}}>
                {(profitLoss && usdFormatter.format(Number(profitLoss))) || '-'}{' '}
              </ListItem>
            </List>
            {properties.map((p, index) => (
              <List className={classes.subList} key={index}>
                <ListItem>{p.label}</ListItem>
                <ListItem style={{fontWeight: 'bold'}}>
                  {p.isUSD ? usdFormatter.format(data[p.field]) : data[p.field]}
                </ListItem>
              </List>
            ))}
          </List>
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
      </AccordionDetails>
    </Accordion>
  );
};
