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
import { OrderData, PairInfoExplorer } from 'types/app';
import { parsePairExplorerData } from 'utils/parse';
import { getContractOrders, getPairExplorer } from 'services/graphql/bitquery';
import { GET_DEFAULT_QUOTE } from 'shared/constants/Blockchain';


const TVChartContainer = React.lazy(() => import('../../../../shared/components/chart/TvChart/tv_chart'));

type PropsParams = {
  address: string;
}

type Props = RouteComponentProps<PropsParams>


const PairExplorer: React.FC<Props> = (props) => {
  const {match: { params }} = props;
  const {address} = params;

  const { chainId } = useWeb3();


  const [infoData, setInfoData] = useState<PairInfoExplorer>();
  const [tableData, setTableData] = useState<OrderData[]>([]);

  useEffect(() => {
    if (address) {
      getPairExplorer(GET_NETWORK_NAME(chainId), EXCHANGE.UNISWAP, address, GET_DEFAULT_QUOTE(chainId))
        .then(info => { setInfoData(info) })
        .catch(e => console.log(e))

      getContractOrders(GET_NETWORK_NAME(chainId), EXCHANGE.UNISWAP, address, GET_DEFAULT_QUOTE(chainId), 7, 0, null, null)
        .then(orders => { setTableData(orders)})
        .catch(e => console.log(e))
    }
  }, [address, chainId]);

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
            {
              infoData && <>
              <Info data={infoData} />
              <Grid item xs={12} md={12} style={{marginTop: 44, height: 450}}>
                <TVChartContainer symbol={`${infoData?.baseToken.symbol}-${infoData?.quoteToken.symbol}`} chainId={1} />
              </Grid></>
            }
          </Grid>

          <Grid item xs={12} md={7}>
            <Grid item xs={12} md={12}>
              <Paper style={{ padding: 10 }}>
                <TokenSearch url={`/protocol-explorer/uniswap/pair-explorer`} />
              </Paper>
            </Grid>

            <Grid style={{ marginTop: 20 }} item xs={12} md={12}>
              <OrderNTransaction transactionData={tableData} />
            </Grid>

          </Grid>
        </GridContainer>
      </Box>

      <InfoView />
    </>
  );
};

export default PairExplorer;
