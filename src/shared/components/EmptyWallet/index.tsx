import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {ReactComponent as ConnectivityImage} from 'assets/images/state/connectivity-04.svg';
import React from 'react';
import Transak from '../Transak';


export const EmptyWallet = () => {

  return (
    <Box py={4}>
      <Grid
        container
        alignItems='center'
        alignContent='center'
        justify='center'
        direction='column'
        spacing={2}>
        <Grid item xs={12}>
          <ConnectivityImage />
        </Grid>
        <Grid item xs={8}>
          <Typography
            style={{textTransform: 'uppercase'}}
            gutterBottom
            align='center'
            >
              Your wallet is empty, buy with Fiat: 
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Transak/>
        </Grid>
      </Grid>
    </Box>
  );
};
