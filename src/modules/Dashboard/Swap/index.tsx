import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import {SwapComponent} from './Swap';

const SwapLayout = () => {
  console.log('sadasdsa');

  return (
    <Box pt={4}>
      <Grid container justify='center' spacing={2}>
        <Grid item xs={12} md={4} xl={4}>
          <SwapComponent />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SwapLayout;
