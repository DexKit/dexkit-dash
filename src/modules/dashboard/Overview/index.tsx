import React, {useEffect, } from 'react';
import Grid from '@material-ui/core/Grid';
import {useDispatch, useSelector} from 'react-redux';
import {onGetCryptoData} from '../../../redux/actions';
import GridContainer from '../../../@crema/core/GridContainer';
import InfoView from '../../../@crema/core/InfoView';
import Box from '@material-ui/core/Box';
import {AppState} from '../../../redux/store';
import PopularCoins from './PopularCoins';
import ReportCard from './ReportCard';
import RelatedCourses from './RelatedCourses';
import { MOCK, NEWS} from './mockedData'

interface CryptoProps {}

const Overview: React.FC<CryptoProps> = () => {
  
  const dispatch = useDispatch();

  useEffect(() => {
  
    dispatch(onGetCryptoData());
  }, [dispatch]);

  const {cryptoData} = useSelector<AppState, AppState['dashboard']>(
    ({dashboard}) => dashboard,
  );

  console.log('dashboard', cryptoData)

  return (
    <>
      {cryptoData ? (
        <Box pt={{xl: 4}}>
          <GridContainer>
            <Grid item xs={12} md={4} >
              <ReportCard data={MOCK} />
            </Grid>
            <Grid item xs={12} md={4} >
              <ReportCard data={MOCK} />
            </Grid>
            <Grid item xs={12} md={4} >
              <ReportCard data={MOCK} />
            </Grid>
            <Grid item xs={12} md={4}>
            <GridContainer >
              <Grid item xs={12} sm={12} md={12}>
              <PopularCoins title="Trending Coins on ZRX" popularCoins={[cryptoData.popularCoins[0], cryptoData.popularCoins[1]]} />
              </Grid>
              <Grid style={{backgroundColor: 'white', borderRadius: 10}} item xs={12} sm={12} md={12}>
              <RelatedCourses relatedCourses={NEWS} />
            </Grid>
            </GridContainer>
            </Grid>
            <Grid item xs={12} md={4}>
            <PopularCoins title="Trending Coins on Uniswap" popularCoins={cryptoData.popularCoins} />
            </Grid>
            <Grid item xs={12} md={4}>
              <PopularCoins title="Trending Coins on ZRX" popularCoins={cryptoData.popularCoins} />
            </Grid>
           
          </GridContainer>
        </Box>
      ) : null}

      <InfoView />
    </>
  );
};

export default Overview;


