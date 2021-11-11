import React from 'react';

import IntlMessages from '@crema/utility/IntlMessages';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import {makeStyles} from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles((theme) => ({
  container: {
    color: '#fff',
    borderRadius: 6,
    background: '#2e3243',
    padding: theme.spacing(2),
  },
  innerContent: {
    padding: theme.spacing(1),
    justifyContent: 'space-between',
    fontSize: '1rem',
  },
}));

function CardPrizeSkeleton(): JSX.Element {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Grid container className={classes.innerContent}>
        <Grid item>
          <Typography variant='subtitle2' style={{color: '#7A8398'}}>
            <IntlMessages id='app.coinLeagues.prizePool' />
          </Typography>
          <Typography variant='h4' style={{color: '#fff'}}>
            <Skeleton>- MATIC</Skeleton>
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CardPrizeSkeleton;
