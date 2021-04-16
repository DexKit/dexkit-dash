import React, { useEffect, useState } from 'react';

import Grid from '@material-ui/core/Grid';
import Info from './info';
import { useDispatch } from 'react-redux';
import { onGetCryptoData, onGetAnalyticsData } from '../../../../redux/actions';
import GridContainer from '../../../../@crema/core/GridContainer';
import InfoView from '../../../../@crema/core/InfoView';
import Box from '@material-ui/core/Box';

import OrderNTransaction from './OrderNTransaction';
import { Paper, Typography, Link, Breadcrumbs } from '@material-ui/core';
import { DexTradePoolInfo } from 'types/bitquery/dexTradePoolInfo.interface';
import { useQuery } from '@apollo/client';

import { BITQUERY_PAIR_EXPLORER, BITQUERY_CONTRACT_ORDERS } from 'services/graphql/bitquery/gql';
import { bitQueryClient } from '../../../../services/graphql';
import { Loader } from '@crema';
import { TransactionDataNew } from 'types/models/Analytics';
import { DexTradeTransaction } from 'types/bitquery/dexTradeTransaction.interface';
import { RouteComponentProps } from 'react-router-dom';
import { TokenSearch } from 'shared/components/TokenSearch';
import { EXCHANGE, GET_NETWORK_NAME } from 'shared/constants/Bitquery';
import { useWeb3 } from 'hooks/useWeb3';
import { PairInfoExplorer } from 'types/app';
import { parsePairExplorerData } from 'utils/parse';

const TVChartContainer = React.lazy(() => import('../../../../shared/components/chart/TvChart/tv_chart'));

type PairExplorerParams = {
  address: string;
};

type AddressProp = {
  address: string;
}

type PairExplorerProps = RouteComponentProps<PairExplorerParams>


const parseTradesToInfoProps = (data: any, address: string): PairInfoExplorer[] => {
  console.log('parseTradesToInfoProps', data);
  // return data.map(d => {
  //   return {
  //     address: address,
  //     baseAmount: d.baseAmount,
  //     baseAmountInCurrency: d.baseAmountInUSD,
  //     dailyVolume: d.tradeAmountInUSD,
  //     pairSymbols: { base: d.baseCurrency.symbol, quote: d.quoteCurrency.symbol },
  //     quoteAmount: d.quoteAmount,
  //     quoteAmountInCurrency: d.quoteAmountInUSD,
  //     priceChangePercentage24h: 1.24,
  //     quotePrice: d.quotePrice,
  //     totalLiquidy: 0
  //   } as InfoData;
  // });
  return [];
}

const parseTradesToTransactionDataNew = (data: DexTradeTransaction[]):TransactionDataNew[] =>  {
  console.log(data);
  return data.map( (d, i) => {
    return {
      id: `${d.transaction.hash}(${i})`,
      amount: d.tradeAmount.toFixed(8),
      type: d.side,
      price: d.quotePrice.toFixed(4),
      total: d.tradeAmountIsUsd.toFixed(2),
      time: d.timeInterval.second,
      pair: d.timeInterval.second,
      poolVariation: NaN, 
      totalValue: d.quoteAmountInUsd.toFixed(6)
    } as TransactionDataNew;
  });
}

const CustomInfo: React.FC<AddressProp> = (props) => {
  const { address } = props;
  const { chainId } = useWeb3();

  const { loading, error, data } = useQuery<{ ethereum: { dexTrades: DexTradePoolInfo[] }}>(BITQUERY_PAIR_EXPLORER, {
    client: bitQueryClient,
    variables: {
      network: GET_NETWORK_NAME(chainId),
      address,
      exchangeName: "Uniswap"
     }
  });

  if (loading) return <Loader/>;
  if (error) return <><Typography color="error">{JSON.stringify(error)}</Typography></>;

  const totalBalanceData = parsePairExplorerData(data, address, GET_NETWORK_NAME(chainId));

  return totalBalanceData ? (<>
    <Info totalBalanceData={totalBalanceData} />
    <Grid item xs={12} md={12} style={{marginTop: 44, height: 450}}>
      <TVChartContainer symbol={`${totalBalanceData.baseToken.symbol}-${totalBalanceData.quoteToken.symbol}`} chainId={1} />
    </Grid></>
  ) : null;
}

const CustomOrderNTransaction: React.FC<AddressProp> = (props) => {
  const { address } = props;
  const { chainId } = useWeb3();

  const { loading, error, data } = useQuery<{ ethereum: { dexTrades: DexTradeTransaction[] }}>(BITQUERY_CONTRACT_ORDERS, {
    client: bitQueryClient,
    variables: {
      network: GET_NETWORK_NAME(chainId),
      address,
      limit: 9,
      offset: 0
     }
  });
  if (loading) return <Loader/>;
  if (error) return <><Typography color="error">{JSON.stringify(error)}</Typography></>;
  const transactions = parseTradesToTransactionDataNew(data?.ethereum?.dexTrades ?? []);
  return transactions ? <OrderNTransaction transactionData={transactions}/> : null;
}

const PairExplorer: React.FC<PairExplorerProps> = (props) => {
  const {match: { params }} = props;

  const { address } = params;

  console.log(address);

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
                Uniswap
              </Link>
              <Typography color="textPrimary">Pair Explorer</Typography>
            </Breadcrumbs>
            <Typography variant="h4" color="textPrimary">Pair Explorer</Typography>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <CustomInfo address={address} />
          </Grid>

          <Grid item xs={12} md={7}>
            <Grid item xs={12} md={12}>
              <Paper style={{ padding: 10 }}>
                <TokenSearch url={`/protocol-explorer/uniswap/pair-explorer`} />
              </Paper>
            </Grid>

            <Grid style={{ marginTop: 20 }} item xs={12} md={12}>
              <CustomOrderNTransaction address={address}/>
            </Grid>

          </Grid>
        </GridContainer>
      </Box>

      <InfoView />
    </>
  );
};

export default PairExplorer;
