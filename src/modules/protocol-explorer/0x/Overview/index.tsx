import React, {useEffect} from 'react';

import GridContainer from '../../../../@crema/core/GridContainer';
import InfoView from '../../../../@crema/core/InfoView';

import {onGetAnalyticsData} from '../../../../redux/actions';



import {AppState} from '../../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid } from '@material-ui/core';
// import OrderNTransaction from 'modules/dashboard/Analytics/OrderNTransaction';

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
            <Grid item xs={12} md={12}>
              {/* <OrderNTransaction
                transactionData={analyticsData.transactionData}
              /> */}
            </Grid>
    
          </GridContainer>
        </Box>
      ) : null}

      <InfoView />
    </>
  );
};

export default Overview;
