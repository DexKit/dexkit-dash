import React from 'react';
import Grid from '@material-ui/core/Grid';




import GridContainer from '../../../@crema/core/GridContainer';
import InfoView from '../../../@crema/core/InfoView';
import Box from '@material-ui/core/Box';
import AppsTable from './apps-table';
import KitLocked from './KitLocked';

const MyApps: React.FC = () => {
  return (
    <>
        <Box pt={{xl: 4}}>
          <GridContainer>
            <Grid item xs={12} md={6}>
             <KitLocked/>
            </Grid>
            <Grid item xs={12} md={12}>
              <AppsTable/>
            </Grid>
            <Grid item xs={12} md={4}>
             
            </Grid>  
            <Grid item xs={12} md={6}>
             
            </Grid>
          </GridContainer>
        </Box>


      <InfoView />
    </>
  );
};

export default MyApps;
