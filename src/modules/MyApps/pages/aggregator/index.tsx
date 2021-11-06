import React from 'react';

import {Link as RouterLink} from 'react-router-dom';

import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';

import {makeStyles} from '@material-ui/core';

import AggregatorStepper from 'modules/MyApps/components/AggregatorStepper';
import IntlMessages from '../../../../@crema/utility/IntlMessages';

const useStyles = makeStyles(() => ({
  linkBtn: {
    color: '#fff',
    textDecoration: 'none',
    textTransform: 'capitalize',
  },
}));

const AggregatorPage: React.FC = () => {
  const classes = useStyles();

  return (
    <Grid container spacing={2}>
      <Grid container spacing={2}>
        <Grid container>
          <Breadcrumbs
            style={{color: '#fff', fontSize: '0.8rem'}}
            separator='/'>
            <Link
              underline='none'
              component={RouterLink}
              to='/wallet'
              className={classes.linkBtn}>
              <Typography variant='subtitle2'>
                <IntlMessages id='app.myApps.dashboard' />
              </Typography>
            </Link>
            <Link
              underline='none'
              component={RouterLink}
              to='/my-apps/manage'
              className={classes.linkBtn}>
              <Typography variant='subtitle2'>
                <IntlMessages id='app.myApps.manageApps' />
              </Typography>
            </Link>
            <Typography variant='subtitle2' style={{color: '#2e3243'}}>
              <IntlMessages id='app.myApps.aggregator' />
            </Typography>
          </Breadcrumbs>
        </Grid>
        <Grid container alignContent='center'>
          <Grid item xs={12} sm={10}>
            <Typography
              variant='h5'
              style={{margin: 5, fontWeight: 600, marginBottom: 20}}>
              <IntlMessages id='app.myApps.aggregator' />
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid container style={{marginTop: 15}}>
        <AggregatorStepper />
      </Grid>
    </Grid>
  );
};

export default AggregatorPage;
