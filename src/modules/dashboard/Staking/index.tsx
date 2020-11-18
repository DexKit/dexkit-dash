import React from 'react';
import Grid from '@material-ui/core/Grid';
import StakeBoard from './Stakeboard';

import GridContainer from '../../../@crema/core/GridContainer';
import InfoView from '../../../@crema/core/InfoView';
import Box from '@material-ui/core/Box';
import StakingEpochs from './StakingEpochs';
import Epoch from './Epoch';

interface CryptoProps {}

const Staking: React.FC<CryptoProps> = () => {
 
  return (
    <>
     
        <Box pt={{xl: 4}}>
          <GridContainer>
           <Grid item xs={12} md={3}>
              <Epoch />
            </Grid>
            <Grid item xs={12} md={7}>
              <StakeBoard  />
            </Grid>

            <Grid item xs={12} md={12}>
              <StakingEpochs />
            </Grid>

          </GridContainer>
        </Box>
      

      <InfoView />
    </>
  );
};

export default Staking;
