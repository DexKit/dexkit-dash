import React from 'react';

import Grid from '@material-ui/core/Grid';
import Info from './info-amm';
import GridContainer from '../../../../@crema/core/GridContainer';
import InfoView from '../../../../@crema/core/InfoView';
import Box from '@material-ui/core/Box';

import { Paper, Typography, Link, Breadcrumbs } from '@material-ui/core';

import { Loader } from '@crema';
import { RouteComponentProps } from 'react-router-dom';
import { EXCHANGE} from 'shared/constants/Bitquery';

import { TokenSearchByList } from 'shared/components/TokenSearchByList';

import { useAMMPairTrades } from 'hooks/useAMMPairTrades';
import { useAMMPairExplorer } from 'hooks/useAMMPairExplorer';
import AMMTradeHistory from './AMMTradeHistory';
import InfoAMM from './info-amm';



const TVChartContainer = React.lazy(() => import('../../../../shared/components/chart/TvChart/tv_chart'));

type PropsParams = {
  address: string;
}

type Props = RouteComponentProps<PropsParams>


const PairExplorer: React.FC<Props> = (props) => {
  const {match: { params }} = props;
  const {address} = params;
  const { isLoadingTrades, 
          trades, 
          totalTrades, 
          page, 
          rowsPerPage, 
          onChangePage, 
          onChangeRowsPerPage} = useAMMPairTrades(address, EXCHANGE.SUSHISWAP);

  const {isLoadingInfo, infoData} = useAMMPairExplorer(address, EXCHANGE.SUSHISWAP)

  const getPairTitle = () => {
    if(infoData){
       return `- ${infoData?.baseToken.symbol}/${infoData?.quoteToken.symbol}`
    }
  }


  return (
    <>
      <Box pt={{ xl: 4 }}>
        <GridContainer>
          <Grid item xs={12} md={12}>
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" href="/" >
                Protocol Explorer
              </Link>
              <Link color="inherit" href="/protocol-explorer/sushiwap/pair-explorer" >
               SushiSwap
              </Link>
              <Typography color="textPrimary">Pair Explorer</Typography>
            </Breadcrumbs>
            <Typography variant="h4" color="textPrimary">Pair Explorer {getPairTitle()}</Typography>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <Grid item xs={12} md={12}>
                <Paper style={{ padding: 10 }}>
                  <TokenSearchByList url={`/protocol-explorer/sushiswap/pair-explorer`} type='pair'/>
                </Paper>
              </Grid>
            {
              isLoadingInfo ? <Loader/> :
              (infoData && 
              <Paper style={{ marginTop: 20 }}>
                 <InfoAMM  data={infoData} /> 
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
                    
              />
          </Grid>


        </GridContainer>
      </Box>

      <InfoView />
    </>
  );
};

export default PairExplorer;
