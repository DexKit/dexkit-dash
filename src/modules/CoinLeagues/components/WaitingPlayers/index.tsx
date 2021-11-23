import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import {ReactComponent as Social3} from 'assets/images/icons/social-3.svg';

export const WaitingPlayers = () => {
  return (
    <Box p={2}>
      <Grid container justifyContent={'center'}>
        <Grid item>
          <Box
            display={'flex'}
            justifyContent={'center'}
            flexDirection={'column'}>
            <Box display={'flex'} justifyContent={'center'}>
              <Social3 />
            </Box>
            <Box>
              <Typography variant='body2' color='textSecondary'>
                WAITING FOR PLAYERS...
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
