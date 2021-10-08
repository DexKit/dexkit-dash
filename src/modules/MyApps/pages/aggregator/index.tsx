import React from 'react';

import {Link, BrowserRouter as Router} from 'react-router-dom';

import {GridContainer} from '@crema';
import {Breadcrumbs, Grid, Typography} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import AggregatorStepper from 'modules/MyApps/components/AggregatorStepper';

const AggregatorPage: React.FC = () => {
  return (
    <GridContainer spacing={2}>
      <GridContainer spacing={2}>
        <Grid container>
          <Router>
            <Breadcrumbs
              style={{color: '#fff', fontSize: '0.8rem'}}
              separator={<NavigateNextIcon fontSize='small' />}>
              <Link to='/wallet' style={{textDecoration: 'none'}}>
                <Typography variant='subtitle2'>Dashboard</Typography>
              </Link>
              <Link to='/my-apps/manage' style={{textDecoration: 'none'}}>
                <Typography variant='subtitle2'>Manage apps</Typography>
              </Link>
              <Typography variant='subtitle2' style={{color: '#2e3243'}}>
                Aggregator
              </Typography>
            </Breadcrumbs>
          </Router>
        </Grid>
        <Grid container xs={12} sm={10} alignContent='center'>
          <Typography
            variant='h5'
            style={{margin: 5, fontWeight: 600, marginBottom: 20}}>
            Aggregator
          </Typography>
        </Grid>
      </GridContainer>

      <Grid container style={{marginTop: 15}}>
        <AggregatorStepper />
      </Grid>
    </GridContainer>
  );
};

export default AggregatorPage;
