import React from 'react';

import {useIntl} from 'react-intl';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import Skeleton from '@material-ui/lab/Skeleton';
import {makeStyles} from '@material-ui/core/styles';

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

function CountdownSkeleton(): JSX.Element {
  const classes = useStyles();
  const {messages} = useIntl();

  return (
    <Container className={classes.container}>
      <Grid container className={classes.innerContent}>
        <Grid item>
          <Typography variant='subtitle2' style={{color: '#7A8398'}}>
            {messages['app.countdown']}
          </Typography>
          <Typography variant='h4' style={{color: '#fff'}}>
            <Skeleton>-</Skeleton>
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CountdownSkeleton;
