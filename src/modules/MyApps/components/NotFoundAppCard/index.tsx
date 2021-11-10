import React from 'react';

import {Grid, Typography} from '@material-ui/core';
import IntlMessages from '@crema/utility/IntlMessages';

import {ReactComponent as SearchNotFoundIcon} from 'assets/images/icons/search-not-found.svg';

const NotFoundAppCard: React.FC = () => {
  return (
    <Grid container spacing={4} justifyContent='center'>
      <Grid item xs={2}>
        <SearchNotFoundIcon />
      </Grid>
      <Grid item xs={10}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant='h4'>
              <IntlMessages id='app.myApps.searchNotFound' />
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='subtitle2'>
              <IntlMessages id='app.myApps.searchNotFoundPleaseTryAgain' />
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default NotFoundAppCard;
