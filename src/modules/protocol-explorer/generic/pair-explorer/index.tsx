import React, { PropsWithChildren, useEffect, useState } from 'react';

import Grid from '@material-ui/core/Grid';
import Info from './info';
import GridContainer from '../../../../@crema/core/GridContainer';
import InfoView from '../../../../@crema/core/InfoView';
import Box from '@material-ui/core/Box';

import OrderNTransaction from './OrderNTransaction';
import { Paper, Typography, Link, Breadcrumbs } from '@material-ui/core';
import { RouteComponentProps } from 'react-router-dom';
import { TokenSearch } from 'shared/components/TokenSearch';
import { GET_EXCHANGE_NAME, GET_NETWORK_NAME } from 'shared/constants/Bitquery';
import { useWeb3 } from 'hooks/useWeb3';
import { OrderData, PairInfoExplorer } from 'types/app';
import { getContractOrders, getPairExplorer } from 'services/graphql/bitquery';
import { GET_DEFAULT_QUOTE } from 'shared/constants/Blockchain';
import { EXCHANGE, NETWORK } from 'shared/constants/AppEnums';
import { truncateAddress } from 'utils';
import PageTitle from 'shared/components/PageTitle';


const TVChartContainer = React.lazy(() => import('../../../../shared/components/chart/TvChart/tv_chart'));

type PropsParams = {
  address: string;
  exchange: EXCHANGE;
  networkName: NETWORK;
}


type Props = RouteComponentProps<PropsParams> & PropsWithChildren<PropsParams>;


const PairExplorer: React.FC<Props> = (props) => {
  const {match: { params }} = props;
  const {networkName, exchange, address} = params;

  const { chainId } = useWeb3();

  const [infoData, setInfoData] = useState<PairInfoExplorer>();
  const [tableData, setTableData] = useState<OrderData[]>([]);


  useEffect(() => {
    if (address) {
      getPairExplorer(GET_NETWORK_NAME(chainId), exchange, address, GET_DEFAULT_QUOTE(chainId))
        .then(info => { setInfoData(info) })
        .catch(e => console.log(e))

      getContractOrders(GET_NETWORK_NAME(chainId), exchange, address, GET_DEFAULT_QUOTE(chainId), 7, 0, null, null)
        .then(orders => { setTableData(orders)})
        .catch(e => console.log(e))
    }
  }, [address, chainId]);

  return (
    <>
      <Box pt={{ xl: 4 }}>

        <PageTitle
          history={
            exchange == EXCHANGE.ALL ? [
              {url:`/${networkName}/protocol-explorer/${exchange}/overview`, name: 'Protocol Explorer'}
            ]:[
              {url:`/${networkName}/protocol-explorer/${exchange}/overview`, name: 'Protocol Explorer'},
              {url:`/${networkName}/protocol-explorer/${exchange}/pair-explorer`, name:  GET_EXCHANGE_NAME(exchange)}
            ]}
          active={`Pair Explorer`}
          title={exchange == EXCHANGE.ALL ? `Pair Explorer` : `Pair Explorer ${truncateAddress(address)}`}
        />
        
        <GridContainer>
          <Grid item xs={12} md={5}>
            {
              infoData && <>
                <Info data={infoData} />
                <Grid item xs={12} md={12} style={{marginTop: 44, height: 450}}>
                  <TVChartContainer symbol={`${infoData?.baseToken.symbol}-${infoData?.quoteToken.symbol}`} chainId={1} />
                </Grid>
              </>
            }
          </Grid>

          <Grid item xs={12} md={7}>
            <Grid item xs={12} md={12}>
              <Paper style={{ padding: 10 }}>
                {
                  exchange && <TokenSearch exchangeName={exchange} type={'pair'} />
                }
              </Paper>
            </Grid>

            <Grid style={{ marginTop: 20 }} item xs={12} md={12}>
              <OrderNTransaction transactionData={tableData} exchange={exchange} network={networkName} />
            </Grid>

          </Grid>
        </GridContainer>
      </Box>

      <InfoView />
    </>
  );
};

export default PairExplorer;
