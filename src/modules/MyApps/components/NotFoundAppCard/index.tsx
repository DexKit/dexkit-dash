import React from 'react';

import {GridContainer} from '@crema';
import {Grid, Typography} from '@material-ui/core';
import IntlMessages from '@crema/utility/IntlMessages';

import {ReactComponent as SearchNotFoundIcon} from 'assets/images/icons/search-not-found.svg';

const NotFoundAppCard: React.FC = () => {
  return (
    <GridContainer spacing={4} justifyContent='center' style={{margin: 15}}>
      <Grid item xs={2} style={{textAlign: 'center'}}>
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
    </GridContainer>
  );
};

export default NotFoundAppCard;
