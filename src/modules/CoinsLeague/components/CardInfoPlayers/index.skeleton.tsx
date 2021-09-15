import React from 'react';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';

import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {ReactComponent as People} from 'assets/images/icons/people.svg'
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles((theme) => ({
  container: {
    color: '#fff',
    borderRadius: 6,
    background: '#2e3243',
    padding: theme.spacing(2),
  },
  innerContent: {
    padding: theme.spacing(2),
    justifyContent: 'space-between',
    fontSize: '1rem',
  },
}));



function CardInfoPlayersSkeleton(): JSX.Element {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Grid container className={classes.innerContent}>
        <Grid item xs={12} justifyContent={'center'} alignItems={'center'} alignContent={'center'} >
          <Button fullWidth variant={'contained'}  startIcon={<People/>}>
          <Skeleton>  {`PLAYERS ${0} (${10})`}</Skeleton>
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CardInfoPlayersSkeleton;
