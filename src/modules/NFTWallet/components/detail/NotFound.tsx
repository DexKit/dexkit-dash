import React from 'react';
import {Grid, Typography, Button, Box} from '@material-ui/core';
import IntlMessages from '@crema/utility/IntlMessages';
import {Link as RouterLink} from 'react-router-dom';

interface Props {}

export default (props: Props) => {
  return (
    <Box py={8}>
      <Grid
        justify='center'
        alignItems='center'
        direction='column'
        container
        spacing={4}>
        <Grid item>
          <Typography variant='h1' align='center'>
            <IntlMessages id='common.error404' />
          </Typography>
          <Typography variant='h4' align='center' color='textSecondary'>
            <IntlMessages id='common.sorryPageNotFound' />
          </Typography>
        </Grid>
        <Grid item>
          <Grid container spacing={2} justify='center'>
            <Grid item>
              <Button
                component={RouterLink}
                variant='contained'
                color='primary'
                size='large'
                to='/'>
                <IntlMessages id='common.goHome' />
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant='outlined'
                color='primary'
                size='large'
                href='mailto:contact@dexkit.com'>
                <IntlMessages id='common.contactUs' />
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
