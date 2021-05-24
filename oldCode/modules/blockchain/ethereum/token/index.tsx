import React, {useEffect} from 'react';
import Grid from '@material-ui/core/Grid';



import {useDispatch, useSelector} from 'react-redux';
import Box from '@material-ui/core/Box';

import Swap from './Swap';
import History from './History';

import CryptoGraph from './CryptoGraph';
import { onGetCryptoData } from 'redux/actions';
import { AppState } from 'redux/store';
import { GridContainer, InfoView } from '@crema';

interface CryptoProps {}

const Token: React.FC<CryptoProps> = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(onGetCryptoData());
  }, [dispatch]);

  const {cryptoData} = useSelector<AppState, AppState['dashboard']>(
    ({dashboard}) => dashboard,
  );

  return (
    <>
      {cryptoData ? (
        <Box pt={{xl: 4}}>
          <GridContainer>
          <Grid item xs={12} md={8}>
              <CryptoGraph  coinGraphData={cryptoData.coinGraphData.bitcoin} coin={'BTC'}/>
            </Grid>
            <Grid item xs={12} md={4}>
              <Swap  buySell={cryptoData.buySell}/>
            </Grid>
            <Grid item xs={12} md={12}>
              <History/>
            </Grid>
          
          
          </GridContainer>
        </Box>
      ) : null}

      <InfoView />
    </>
  );
};

export default Token;
