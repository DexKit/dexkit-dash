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
import { Paper, TextField, InputAdornment, Typography, Link, Breadcrumbs, InputLabel, FormControl, Select, MenuItem } from '@material-ui/core';
import { SearchRounded } from '@material-ui/icons';
import { DexTradePoolInfo } from 'types/bitquery/dexTradePoolInfo.interface';
import { useQuery } from '@apollo/client';

import { BITQUERY_PAIR_EXPLORER, BITQUERY_TRADE_HISTORY } from 'services/graphql/bitquery/gql';
import { bitQueryClient } from '../../../../services/graphql';
import { Loader } from '@crema';
import { TransactionDataNew } from 'types/models/Analytics';
import { DexTradeTransaction } from 'types/bitquery/dexTradeTransaction.interface';
// import { Loader } from '@crema';



interface CryptoProps { }

const parseTradesToTotalBalanceProps = (data: DexTradePoolInfo[]): TotalBalanceData[] => {
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

const CustomTotalBalance: React.FC = () => {
  const { loading, error, data } = useQuery<{ ethereum: { dexTrades: DexTradePoolInfo[] }}>(BITQUERY_PAIR_EXPLORER, {
    client: bitQueryClient,
    variables: {
      address: "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852",
      exchangeName: "Uniswap",
      limit: 1
     }
  });
  if (loading) return <Loader/>;
  if (error) return <><Typography color="error">{JSON.stringify(error)}</Typography></>;
  return data ? <TotalBalance totalBalanceData={parseTradesToTotalBalanceProps(data.ethereum.dexTrades)[0]} /> : null;
}

const CustomOrderNTransaction: React.FC = () => {
  const { loading, error, data } = useQuery<{ ethereum: { dexTrades: DexTradeTransaction[] }}>(BITQUERY_TRADE_HISTORY, {
    client: bitQueryClient,
    variables: {
      address: "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852",
      exchangeName: "Uniswap",
      limit: 10
     }
  });
  if (loading) return <Loader/>;
  if (error) return <><Typography color="error">{JSON.stringify(error)}</Typography></>;
  return data ? <OrderNTransaction transactionData={parseTradesToTransactionDataNew(data.ethereum.dexTrades)}/> : null;
}

const Crypto: React.FC<CryptoProps> = () => {
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
            <CustomTotalBalance />
          </Grid>

          <Grid item xs={12} md={7}>
            <Grid item xs={12} md={12}>
              <Paper style={{ padding: 10 }}>
                <GridContainer>

                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      id="input-with-icon-textfield"
                      variant='outlined'
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchRounded />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth  >
                      <InputLabel style={{ marginLeft: 20 }} id="demo-simple-select-label">Filter</InputLabel>
                      <Select
                        variant='outlined'
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                      >
                        <MenuItem value="">
                          <em>View All</em>
                        </MenuItem>

                      </Select>
                    </FormControl >
                  </Grid>
                </GridContainer>
              </Paper>
            </Grid>

            <Grid style={{ marginTop: 20 }} item xs={12} md={12}>
              {/* <OrderNTransaction
                transactionData={POOLS}
              /> */}
              <CustomOrderNTransaction/>
            </Grid>

          </Grid>
        </GridContainer>
      </Box>

      <InfoView />
    </>
  );
};

export default Crypto;
