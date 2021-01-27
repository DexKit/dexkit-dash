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
import {POOLS} from './mock'
import {  Paper, TextField, InputAdornment, Typography, Link, Breadcrumbs, InputLabel, FormControl, Select, MenuItem } from '@material-ui/core';
import {SearchRounded} from '@material-ui/icons';



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
          <Grid item xs={12} md={12}>
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" href="/" >
                Protocol Explorer
              </Link>
              <Link color="inherit" href="/getting-started/installation/" >
                Uniswuap
              </Link>
              <Typography color="textPrimary">Pair Explorer</Typography>
            </Breadcrumbs>
            <Typography variant="h4"  color="textPrimary">Pair Explorer</Typography>

            </Grid>
              <Grid item xs={12} md={5}>
                <TotalBalance totalBalanceData={cryptoData.totalBalanceData} />
              </Grid>
              
              <Grid item xs={12} md={7}>
              <Grid item xs={12} md={12}>
          <Paper style={{padding: 10}}>
          <GridContainer>

          <Grid item xs={12} md={8}>
            <TextField
            fullWidth
        id="input-with-icon-textfield"
        variant='outlined'
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRounded />
            </InputAdornment>
          ),
        }}
      />
      </Grid>
      <Grid item xs={12} md={4}>
                <FormControl fullWidth  >

          <InputLabel style={{marginLeft: 20}} id="demo-simple-select-label">Filter</InputLabel>
          <Select
            variant='outlined'
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
          >
            <MenuItem value="">
              <em>View All</em>
            </MenuItem>
          
          </Select>
          </FormControl >
          </Grid>
          </GridContainer>
          </Paper>
          

                
            </Grid> 

            <Grid style={{marginTop: 20}} item xs={12} md={12}>
            <OrderNTransaction
                transactionData={POOLS}
              />              
            </Grid> 
             
            </Grid>
          </GridContainer>
        </Box>
      ) : null}

      <InfoView />
    </>
  );
};

export default Crypto;
