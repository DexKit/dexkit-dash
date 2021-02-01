import React, {useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import TotalBalance from './TotalBalance';
import {useDispatch, useSelector} from 'react-redux';
import {onGetCryptoData} from '../../../redux/actions';
import GridContainer from '../../../@crema/core/GridContainer';
import InfoView from '../../../@crema/core/InfoView';
import Box from '@material-ui/core/Box';
import {AppState} from '../../../redux/store';
import SalesState from './SalesState'
import BuySell from './BuySell'
import InfoCard from './InfoCard'
import ProfileCard from './ProfileCard'



import {MOCKET_THING   ,INFOR_CARD} from './MockedData'



  // {
  //   id: number;
  //   amount: string;
  //   type: string;
  //   icon: string;
  // }


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
          <Grid item xs={12} md={5}>
                <Grid item xs={12} md={12}>
                <TotalBalance totalBalanceData={cryptoData.totalBalanceData} />
                </Grid>
                <Grid style={{marginTop: 15}} item xs={12} md={12}>
              <BuySell buySell={
                {
                buyData: {
                value: '',
                price: '',
                amount: '' 
                },
                sellData: {
                  value: '',
                  price: '',
                  amount: '' 
                  }
                }
              } />
              </Grid>
          <GridContainer style={{marginTop: 2}}  >

              {INFOR_CARD.map((state, index) => (
                <Grid item xs={12} sm={3} md={6} key={index}>
                  <InfoCard state={state} />
                </Grid>
              ))} 
          </GridContainer>

              </Grid>

              <Grid item xs={12} md={7}>
                <Grid item xs={12} md={12}>
                <Grid item xs={12} md={7}>
                <div/>
              </Grid>
                </Grid>
             
          <GridContainer>
          <Grid style={{padding: 5}} item xs={12} sm={6} md={6} >
                <ProfileCard />
              </Grid>
          <Grid style={{padding: 5}} item xs={12} sm={6} md={6} >
                <SalesState salesState={MOCKET_THING} />
              </Grid>
              
          </GridContainer>

              </Grid>
          </GridContainer>
        </Box>
      ) : null}

      <InfoView />
    </>
  );
};

export default Crypto;
