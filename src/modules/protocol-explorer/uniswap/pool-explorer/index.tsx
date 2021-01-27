import React, {useEffect} from 'react';
import GridContainer from '../../../../@crema/core/GridContainer';
import InfoView from '../../../../@crema/core/InfoView';
import {onGetAnalyticsData} from '../../../../redux/actions';
import {AppState} from '../../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, Paper, TextField, InputAdornment, Typography, Link, Breadcrumbs, InputLabel, FormControl, Select, MenuItem } from '@material-ui/core';
import {SearchRounded} from '@material-ui/icons';
import OrderNTransaction from './OrderNTransaction';
import {POOLS} from './mock'

const Overview = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(onGetAnalyticsData());
  }, [dispatch]);

  const {analyticsData} = useSelector<AppState, AppState['dashboard']>(
    ({dashboard}) => dashboard,
  );

  return (
    <>
      {analyticsData ? (
        <Box pt={{xl: 4}} clone>
          <GridContainer>   
            <Grid item xs={12} md={7}>
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" href="/" >
                Protocol Explorer
              </Link>
              <Link color="inherit" href="/getting-started/installation/" >
                Uniswuap
              </Link>
              <Typography color="textPrimary">Pool Explorer</Typography>
            </Breadcrumbs>
            <Typography variant="h4"  color="textPrimary">Pool Explorer</Typography>

            </Grid>
            <Grid item xs={12} md={5}>
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
            <Grid item xs={12} md={12}>
              <OrderNTransaction
                transactionData={POOLS}
              />
            </Grid>
    
          </GridContainer>
        </Box>
      ) : null}

      <InfoView />
    </>
  );
};

export default Overview;
