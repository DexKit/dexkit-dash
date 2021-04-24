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

import { Loader } from '@crema';
import { RouteComponentProps } from 'react-router-dom';
import { EXCHANGE, GET_NETWORK_NAME } from 'shared/constants/Bitquery';
import { useWeb3 } from 'hooks/useWeb3';
import { OrderData, PairInfoExplorer } from 'types/app';
import { getContractOrders, getPairExplorer, getLastTradeByPair } from 'services/graphql/bitquery';
import { GET_DEFAULT_QUOTE } from 'shared/constants/Blockchain';
import { TokenSearchByList } from 'shared/components/TokenSearchByList';
import Web3 from 'web3';



const TVChartContainer = React.lazy(() => import('../../../../shared/components/chart/TvChart/tv_chart'));

type PropsParams = {
  address: string;
}

type Props = RouteComponentProps<PropsParams>


const PairExplorer: React.FC<Props> = (props) => {
  const {match: { params }} = props;
  const {address} = params;

  const { chainId } = useWeb3();

  const [isLoadingInfo, setIsLoadingInfo] = useState(false);
  const [isLoadingTrades, setIsLoadingTrades] = useState(false);
  const [infoData, setInfoData] = useState<PairInfoExplorer>();
  const [tableData, setTableData] = useState<OrderData[]>([]);

 const fetchPairData = (pairAddress: string) =>{ 
   setIsLoadingInfo(true);
    setIsLoadingTrades(true);
     getPairExplorer(GET_NETWORK_NAME(chainId), EXCHANGE.UNISWAP, pairAddress, GET_DEFAULT_QUOTE(chainId))
        .then(info => { setInfoData(info);  setIsLoadingInfo(false) })
        .catch(e => setIsLoadingInfo(false))

      getContractOrders(GET_NETWORK_NAME(chainId), EXCHANGE.UNISWAP, pairAddress, GET_DEFAULT_QUOTE(chainId), 7, 0, null, null)
        .then(orders => { setTableData(orders);   setIsLoadingTrades(false); console.log(orders)})
        .catch(e =>   setIsLoadingTrades(false))

 }

  useEffect(() => {
    if (Web3.utils.isAddress(address)) {
      fetchPairData(address);
    }else{
      // We received a different url structure, parse and get pairAddress
      // TODO: investigate better ways to fetch pair
      const splitAddress = address.split('-');
      if(splitAddress.length > 1 && chainId){
        const baseAddress = splitAddress[0];
        getLastTradeByPair(GET_NETWORK_NAME(chainId), EXCHANGE.UNISWAP, baseAddress, GET_DEFAULT_QUOTE(chainId))
        .then(pair => fetchPairData(pair))
      }

    }



  }, [address, chainId]);

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
              <Link color="inherit" href="/getting-started/installation/" >
                Uniswap
              </Link>
              <Typography color="textPrimary">Pair Explorer</Typography>
            </Breadcrumbs>
            <Typography variant="h4" color="textPrimary">Pair Explorer {getPairTitle()}</Typography>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <Grid item xs={12} md={12}>
                <Paper style={{ padding: 10 }}>
                  <TokenSearchByList url={`/protocol-explorer/uniswap/pair-explorer`} type='pair'/>
                </Paper>
              </Grid>
            {
              isLoadingInfo ? <Loader/> :
              (infoData && 
              <Paper style={{ marginTop: 20 }}>
                 <Info  data={infoData} /> 
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
              <OrderNTransaction transactionData={tableData} isLoading={isLoadingTrades} />
          </Grid>


        </GridContainer>
      </Box>

      <InfoView />
    </>
  );
};

export default PairExplorer;
