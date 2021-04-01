import React, { useEffect } from 'react';
import GridContainer from '../../../../@crema/core/GridContainer';
import InfoView from '../../../../@crema/core/InfoView';
import { onGetAnalyticsData } from '../../../../redux/actions';
import { AppState } from '../../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, Paper, Typography, Link, Breadcrumbs } from '@material-ui/core';
import OrderNTransaction from './OrderNTransaction';
import { TokenSearch } from 'shared/components/TokenSearch';
import { POOLS } from './mock'

const Overview = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(onGetAnalyticsData());
  }, [dispatch]);

  const { analyticsData } = useSelector<AppState, AppState['dashboard']>(
    ({ dashboard }) => dashboard,
  );

  return (
    <>
      {analyticsData ? (
        <Box pt={{ xl: 4 }} clone>
          <GridContainer>
            <Grid item xs={12} md={12}>
              <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" href="/" >
                  Protocol Explorer
              </Link>
                <Link color="inherit" href="/getting-started/installation/" >
                  Uniswuap
              </Link>
                <Typography color="textPrimary">Pool Explorer</Typography>
              </Breadcrumbs>
              <Typography variant="h4" color="textPrimary">Pool Explorer</Typography>

            </Grid>

            <Grid item xs={12} md={7}>

            </Grid>
            <Grid item xs={12} md={5}>
              <Paper style={{ padding: 10 }}>
              <TokenSearch />
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
