import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import {SwapComponent} from './Swap';
import SwapHorizontalCircleIcon from '@material-ui/icons/SwapHorizontalCircle';
import { AboutDialog } from './AboutDialog';
import { Fonts } from 'shared/constants/AppEnums';
const SwapLayout = () => {

  return (
    <Box pt={4}>
       <Box display='flex' alignItems='center'>
           <SwapHorizontalCircleIcon color={'primary'} fontSize={'large'} />
          <Box
            component='h3'
            color='text.primary'
            fontWeight={Fonts.BOLD}
            ml={2}>
            Multichain Swap
          </Box>
          <AboutDialog />
        </Box>
      <Grid container justify='center' spacing={2}>
        <Grid item xs={12} md={4} xl={4}>
          <SwapComponent />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SwapLayout;
