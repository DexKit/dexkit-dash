import React, { PropsWithChildren } from 'react';

import Grid from '@material-ui/core/Grid';

import GridContainer from '../../../../@crema/core/GridContainer';
import InfoView from '../../../../@crema/core/InfoView';
import Box from '@material-ui/core/Box';

import { Paper } from '@material-ui/core';
import { EXCHANGE, NETWORK } from 'shared/constants/AppEnums';
import { useAMMPairTrades } from 'hooks/useAMMPairTrades';
import { useAMMPairExplorer } from 'hooks/useAMMPairExplorer';
import PageTitle from 'shared/components/PageTitle';
import { GET_EXCHANGE_NAME } from 'shared/constants/Bitquery';
import { truncateAddress } from 'utils';
import { TokenSearch } from 'shared/components/TokenSearch';
import { Loader } from '@crema';
import InfoAMM from 'modules/protocol-explorer/common/info-amm';
import AMMTradeHistory from 'modules/protocol-explorer/common/AMMTradeHistory';

const TVChartContainer = React.lazy(() => import('../../../../shared/components/chart/TvChart/tv_chart'));

type Props = {
  address: string;
  exchange: EXCHANGE;
  networkName: NETWORK;
}





const PairExplorerAMM = (props: Props) => {
 
  const {networkName, exchange, address} = props;


  const { 
    isLoadingTrades, 
    trades, 
    totalTrades, 
    page, 
    rowsPerPage, 
    onChangePage, 
    onChangeRowsPerPage} = useAMMPairTrades(address, exchange);

 const {isLoadingInfo, infoData} = useAMMPairExplorer(address, exchange)

  return (
    <>
      <Box pt={{ xl: 4 }}>

        <PageTitle
          history={
            exchange === EXCHANGE.ALL ? [
              {url:`/${networkName}/protocol-explorer/${exchange}/overview`, name: 'Protocol Explorer'}
            ]:[
              {url:`/${networkName}/protocol-explorer/${exchange}/overview`, name: 'Protocol Explorer'},
              {url:`/${networkName}/protocol-explorer/${exchange}/pair-explorer`, name:  GET_EXCHANGE_NAME(exchange)}
            ]}
          active={`Pair Explorer`}
          title={exchange === EXCHANGE.ALL ? `Pair Explorer` : `Pair Explorer ${truncateAddress(address)}`}
        />
         <GridContainer>
        <Grid item xs={12} md={5}>
            <Grid item xs={12} md={12}>
                <Paper style={{ padding: 10 }}>
                  {
                    exchange && <TokenSearch exchangeName={exchange} type={'pair'} />
                  }
                </Paper>
              </Grid>
            {
              isLoadingInfo ? <Loader/> :
              (infoData && 
              <Paper style={{ marginTop: 20 }}>
                 <InfoAMM  data={infoData} exchange={exchange} /> 
              </Paper>)
            }
          </Grid>
      
          <Grid item xs={12} md={7}>
            <Grid style={{ marginTop: 20 }} item xs={12} md={12}>
            {(infoData && 
                <Grid item xs={12} md={12} style={{ height: 450}}>
                  <TVChartContainer symbol={`${infoData?.baseToken.symbol}-${infoData?.quoteToken.symbol}`} chainId={1} />
                </Grid>
              )}
            </Grid>
          </Grid>
            
         
          <Grid style={{ marginTop: 20 }} item xs={12} md={12}>
              <AMMTradeHistory 
                transactionData={trades} 
                isLoading={isLoadingTrades} 
                total={totalTrades} 
                page={page}
                perPage={rowsPerPage}
                onChangePage={onChangePage}
                onChangePerPage={onChangeRowsPerPage}
                exchange={exchange}
                networkName={networkName}
                    
              />
          </Grid>


        </GridContainer>
      </Box>

      <InfoView />
    </>
  );
};

export default PairExplorerAMM;
