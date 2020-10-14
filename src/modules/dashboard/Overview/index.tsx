import React, {useEffect} from 'react';
import Grid from '@material-ui/core/Grid';


import LatestNews from './LatestNews';
import {useDispatch, useSelector} from 'react-redux';
import {onGetCryptoData} from '../../../redux/actions';
import GridContainer from '../../../@crema/core/GridContainer';
import InfoView from '../../../@crema/core/InfoView';
import Box from '@material-ui/core/Box';
import {AppState} from '../../../redux/store';
import PopularCoins from './PopularCoins';
import BuyKit from './BuyKit';

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

            <Grid item xs={12} md={8}>
              <PopularCoins popularCoins={cryptoData.popularCoins} />
            </Grid>
            <Grid item xs={12} md={4}>
              <BuyKit  buySell={cryptoData.buySell}/>
            </Grid>


            <Grid item xs={12} md={6}>
              <LatestNews newsData={cryptoData.newsData} />
            </Grid>
          </GridContainer>
        </Box>
      ) : null}

      <InfoView />
    </>
  );
};

export default Crypto;
