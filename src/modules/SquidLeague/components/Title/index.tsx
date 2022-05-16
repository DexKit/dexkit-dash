import React from 'react';
import IntlMessages from '@crema/utility/IntlMessages';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

export const Title = () => {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography color='textPrimary' variant='subtitle1'>
          <IntlMessages
            id='squidLeague.gameInformation'
            defaultMessage={'Squid League'}
          />{' '}
        </Typography>
      </Grid>
    </Grid>
  );
};
