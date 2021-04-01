import React, { useEffect } from 'react';

import Grid from '@material-ui/core/Grid';
import TotalBalance, { TotalBalanceData } from './TotalBalance';
import { useDispatch } from 'react-redux';
import { onGetCryptoData, onGetAnalyticsData } from '../../../../redux/actions';
import GridContainer from '../../../../@crema/core/GridContainer';
import InfoView from '../../../../@crema/core/InfoView';
import Box from '@material-ui/core/Box';
// import { AppState } from '../../../../redux/store';
import OrderNTransaction from './OrderNTransaction';
// import { POOLS } from './mock'
import { Paper, Typography, Link, Breadcrumbs } from '@material-ui/core';
import { DexTradePoolInfo } from 'types/bitquery/dexTradePoolInfo.interface';
import { useQuery } from '@apollo/client';

import { BITQUERY_PAIR_EXPLORER, BITQUERY_TRADE_HISTORY } from 'services/graphql/bitquery/gql';
import { bitQueryClient } from '../../../../services/graphql';
import { Loader } from '@crema';
import { TransactionDataNew } from 'types/models/Analytics';
import { DexTradeTransaction } from 'types/bitquery/dexTradeTransaction.interface';
import { RouteComponentProps } from 'react-router-dom';
import { TokenSearch } from 'shared/components/TokenSearch';
// import { Loader } from '@crema';


type CryptoParams = {
  pair: string;
};

type AddressProp = {
  address: string;
}

type CryptoProps = RouteComponentProps<CryptoParams>

const parseTradesToTotalBalanceProps = (data: DexTradePoolInfo[]): TotalBalanceData[] => {
  console.log('parseTradesToTotalBalanceProps', data);
  return data.map(d => {
    return {
      baseAmount: d.baseAmount,
      baseAmountInCurrency: d.baseAmountInUSD,
      dailyVolume: d.tradeAmountInUSD,
      pairSymbols: { a: d.baseCurrency.symbol, b: d.quoteCurrency.symbol },
      quoteAmount: d.quoteAmount,
      quoteAmountInCurrency: d.quoteAmountInUSD,
      priceChangePercentage24h: 1.24,
      quotePrice: d.quotePrice,
      totalLiquidy: -1100.0
    } as TotalBalanceData;
  });
}

const parseTradesToTransactionDataNew = (data: DexTradeTransaction[]):TransactionDataNew[] =>  {
  return data.map( (d, i) => {
    return {
      id: `${d.transaction.hash}(${i})`,
      amount: d.tradeAmount.toString(),
      type: d.side,
      price: d.quotePrice.toString(),
      total: d.tradeAmountIsUsd.toString(),
      time: d.timeInterval.second,
      pair: d.timeInterval.second,
      poolVariation: NaN, 
      totalValue: d.quoteAmountInUsd.toString()
    } as TransactionDataNew;
  });
}

const CustomTotalBalance: React.FC<AddressProp> = (props) => {
  const { address } = props;
  const { loading, error, data } = useQuery<{ ethereum: { dexTrades: DexTradePoolInfo[] }}>(BITQUERY_PAIR_EXPLORER, {
    client: bitQueryClient,
    variables: {
      address,
      exchangeName: "Uniswap",
      limit: 1
     }
  });
  if (loading) return <Loader/>;
  if (error) return <><Typography color="error">{JSON.stringify(error)}</Typography></>;
  const balances = parseTradesToTotalBalanceProps(data?.ethereum?.dexTrades ?? []);
  const totalBalanceData = balances != null && balances.length > 0 ? balances[0] : undefined;
  return totalBalanceData ? <TotalBalance totalBalanceData={totalBalanceData} /> : null;
}

const CustomOrderNTransaction: React.FC<AddressProp> = (props) => {
  const { address } = props;
  const { loading, error, data } = useQuery<{ ethereum: { dexTrades: DexTradeTransaction[] }}>(BITQUERY_TRADE_HISTORY, {
    client: bitQueryClient,
    variables: {
      address,
      exchangeName: "Uniswap",
      limit: 10
     }
  });
  if (loading) return <Loader/>;
  if (error) return <><Typography color="error">{JSON.stringify(error)}</Typography></>;
  const transactions = parseTradesToTransactionDataNew(data?.ethereum?.dexTrades ?? []);
  return transactions ? <OrderNTransaction transactionData={transactions}/> : null;
}

const Crypto: React.FC<CryptoProps> = (props) => {
  const {match: { params }} = props;
  const { pair: address } = params;
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(onGetCryptoData());
    dispatch(onGetAnalyticsData());
  }, [dispatch]);

  // const { cryptoData } = useSelector<AppState, AppState['dashboard']>(
  //   ({ dashboard }) => dashboard,
  // );

  // const { analyticsData } = useSelector<AppState, AppState['dashboard']>(
  //   ({ dashboard }) => dashboard,
  // );

  return (
    <>
      <Box pt={{ xl: 4 }}>
        <GridContainer>
          <Grid item xs={12} md={12}>
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" href="/" >
                Protocol Explorer
              </Link>
              <Link color="inherit" href="/getting-started/installation/" >
                Uniswuap
              </Link>
              <Typography color="textPrimary">Pair Explorer</Typography>
            </Breadcrumbs>
            <Typography variant="h4" color="textPrimary">Pair Explorer</Typography>

          </Grid>
          <Grid item xs={12} md={5}>
            <CustomTotalBalance address={address}/>
          </Grid>

          <Grid item xs={12} md={7}>
            <Grid item xs={12} md={12}>
              <Paper style={{ padding: 10 }}>
                <TokenSearch />
              </Paper>
            </Grid>

            <Grid style={{ marginTop: 20 }} item xs={12} md={12}>
              {/* <OrderNTransaction
                transactionData={POOLS}
              /> */}
              <CustomOrderNTransaction address={address}/>
            </Grid>

          </Grid>
        </GridContainer>
      </Box>

      <InfoView />
    </>
  );
};

export default Crypto;
