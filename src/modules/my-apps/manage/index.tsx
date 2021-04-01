import React from 'react';
import Grid from '@material-ui/core/Grid';
import GridContainer from '../../../@crema/core/GridContainer';
import InfoView from '../../../@crema/core/InfoView';
import Box from '@material-ui/core/Box';
import AppsTable from './apps-table';
import KitLocked from './KitLocked';
import TotalRewards from './TotalRewards';
import KitMarket from './kit-market';
import IntlMessages from '@crema/utility/IntlMessages';
import Ripple from 'assets/images/ripple.png'
import { teal } from '@material-ui/core/colors';

const MyApps: React.FC = () => {
  return (
    <>
      <Box pt={{ xl: 4 }}>
        <GridContainer>
          <Grid item xs={12} md={6}>
            <KitLocked />
          </Grid>
          <Grid item xs={12} md={6}>
            <TotalRewards />
          </Grid>
          <Grid item xs={12} md={8}>
            <AppsTable />
          </Grid>
          <Grid item xs={12} md={4}>
            <KitMarket
              icon={Ripple}
              bgColor={teal[900]}
              data={{
                price: 4.0,
                increment: 0.8
              }}
              heading={<IntlMessages id='Kit Market' />}
            />
          </Grid>
        </GridContainer>
      </Box>


      <InfoView />
    </>
  );
};

export default MyApps;
