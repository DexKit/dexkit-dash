import React, {useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import TotalBalance from './TotalBalance';
import {useDispatch, useSelector} from 'react-redux';
import {onGetCryptoData, onGetAnalyticsData} from '../../../../redux/actions';
import GridContainer from '../../../../@crema/core/GridContainer';
import InfoView from '../../../../@crema/core/InfoView';
import Box from '@material-ui/core/Box';
import {AppState} from '../../../../redux/store';
import OrderNTransaction from './OrderNTransaction';


interface CryptoProps {}

const Crypto: React.FC<CryptoProps> = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(onGetCryptoData());
    dispatch(onGetAnalyticsData());

  }, [dispatch]);

  const {cryptoData} = useSelector<AppState, AppState['dashboard']>(
    ({dashboard}) => dashboard,
  );

  
  const {analyticsData} = useSelector<AppState, AppState['dashboard']>(
    ({dashboard}) => dashboard,
  );


  return (
    <>
      {cryptoData && analyticsData ? (
        <Box pt={{xl: 4}}>
          <GridContainer>
              <Grid item xs={12} md={5}>
                <TotalBalance totalBalanceData={cryptoData.totalBalanceData} />
              </Grid>
              
              <Grid item xs={12} md={7}>
              <OrderNTransaction
                transactionData={analyticsData.transactionData}
              />
            </Grid>
          </GridContainer>
        </Box>
      ) : null}

      <InfoView />
    </>
  );
};

export default Crypto;
