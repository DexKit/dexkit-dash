import React, {useEffect, } from 'react';
import Grid from '@material-ui/core/Grid';
import {useDispatch, useSelector} from 'react-redux';
import {onGetCryptoData} from '../../../../redux/actions';
import GridContainer from '../../../../@crema/core/GridContainer';
import InfoView from '../../../../@crema/core/InfoView';
import Box from '@material-ui/core/Box';
import {AppState} from '../../../../redux/store';
import PopularCoins from './PopularCoins';
import ReportCard from './ReportCard';
import RecentPatients from './RecentPatients';
import { MOCK, RECENT_PATIENTE} from './mockedData'
import {  Paper, TextField, InputAdornment, Typography, Link, Breadcrumbs, InputLabel, FormControl, Select, MenuItem } from '@material-ui/core';
import {SearchRounded} from '@material-ui/icons';


interface CryptoProps {}

const Overview: React.FC<CryptoProps> = () => {
  
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
          <Grid item xs={12} md={12}>
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" href="/" >
                Protocol Explorer
              </Link>
              <Link color="inherit" href="/getting-started/installation/" >
                Uniswuap
              </Link>
              <Typography color="textPrimary">Token Explorer</Typography>
            </Breadcrumbs>
            <Typography variant="h4"  color="textPrimary">Token Explorer</Typography>

          </Grid>
          <Grid item xs={12} md={8}>
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
            <Grid item xs={12} md={4}>
              
            </Grid>        
          
          <Grid item xs={12} sm={12} md={4}>
                <RecentPatients recentPatients={RECENT_PATIENTE} />
            </Grid>
            <Grid item xs={12} md={4}>
              <PopularCoins title="Trending " popularCoins={cryptoData.popularCoins} />
            </Grid>
            <Grid item xs={12} md={4} >
              
              {MOCK.map((data, index) => (
             <div style={{marginTop: index > 0 ? 36 : '' }}>
             <ReportCard key={data.id} data={data} />
             </div>
              ))}    
            </Grid>
         
           
          </GridContainer>
        </Box>
      ) : null}

      <InfoView />
    </>
  );
};

export default Overview;


