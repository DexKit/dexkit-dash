import React from 'react';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import {makeStyles} from '@material-ui/core/styles';

import SendIcon from 'assets/images/icons/send-square.svg';

const useStyles = makeStyles((theme) => ({
  container: {
    color: '#fff',
    borderRadius: 6,
    background: '#2e3243',
    padding: theme.spacing(2),
  },
  innerContent: {
    justifyContent: 'space-between',
    fontSize: '1rem',
  },
}));

interface Props {
  id: number;
  time: number;
  value: {qty: number; coin?: string};
}

function SimpleCardGame(props: Props): JSX.Element {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Grid container style={{color: '#7a8398'}}>
        <Typography variant='h6'>Game Time:</Typography>
        <Typography variant='h6' style={{fontWeight: 600}}>
          &nbsp;{Math.floor(props.time / 3600)}Hrs
        </Typography>
      </Grid>
      <Typography variant='h4'>ID #{props.id}</Typography>
      <Grid container className={classes.innerContent}>
        <Grid item>
          <Typography variant='h6' style={{color: '#fcc591', fontWeight: 600}}>
            <SendIcon />
            &nbsp;{props.value?.qty} {props.value?.coin || 'ETH'}
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}

export default SimpleCardGame;
