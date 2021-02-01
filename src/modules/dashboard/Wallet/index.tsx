import React, {useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import TotalBalance from './TotalBalance';
import {useDispatch, useSelector} from 'react-redux';
import {onGetCryptoData} from '../../../redux/actions';
import GridContainer from '../../../@crema/core/GridContainer';
import InfoView from '../../../@crema/core/InfoView';
import Box from '@material-ui/core/Box';
import {AppState} from '../../../redux/store';
import Coins from './Coins';
import RecentPatients from './RecentPatients';
import SalesState from './SalesState'

import { MOCKET_THING} from './MockedData'

interface CryptoProps {}

const Crypto: React.FC<CryptoProps> = () => {
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
              <Grid item xs={12} md={6}>
                <TotalBalance totalBalanceData={cryptoData.totalBalanceData} />
              </Grid>

              <Grid item xs={12} md={6}>
                <div/>
              </Grid>           

              <Grid item xs={12} sm={12} md={6}>
                <RecentPatients recentPatients={cryptoData.popularCoins} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Coins coinsData={cryptoData.coinsData} />
              </Grid>
              
              {MOCKET_THING.map((state, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <SalesState state={state} />
                </Grid>
              ))}

          </GridContainer>
        </Box>
      ) : null}

      <InfoView />
    </>
  );
};

export default Crypto;
