import React, {useEffect, useContext} from 'react';
import Grid from '@material-ui/core/Grid';


import LatestNews from './LatestNews';
import {useDispatch, useSelector} from 'react-redux';
import {onGetCryptoData} from '../../../redux/actions';
import GridContainer from '../../../@crema/core/GridContainer';
import InfoView from '../../../@crema/core/InfoView';
import Box from '@material-ui/core/Box';
import {AppState} from '../../../redux/store';
import PopularCoins from './PopularCoins';
import PromoCoins from './PromoCoins';
import BuyKit from './BuyKit';
import { ThemeMode } from 'shared/constants/AppEnums';
import AppContext from '@crema/utility/AppContext';
import AppContextPropsType from 'types/AppContextPropsType';

interface CryptoProps {}

const Overview: React.FC<CryptoProps> = () => {
  const dispatch = useDispatch();
  
  const {updateThemeMode} = useContext<AppContextPropsType>(AppContext);
 


  useEffect(() => {
    if( updateThemeMode){
      updateThemeMode(ThemeMode.DARK)
    }
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
            <Grid item xs={12} md={4}>
              <BuyKit  buySell={cryptoData.buySell}/>
            </Grid>
            <Grid item xs={12} md={4}>
              <PopularCoins popularCoins={cryptoData.popularCoins} />
            </Grid>
            <Grid item xs={12} md={4}>
              <PromoCoins popularCoins={cryptoData.popularCoins} />
            </Grid>
            


            <Grid item xs={12} md={6}>
              <LatestNews newsData={cryptoData.newsData} />
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

export default Overview;
