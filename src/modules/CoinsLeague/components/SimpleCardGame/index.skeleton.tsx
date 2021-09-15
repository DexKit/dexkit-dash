import React from 'react';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import {makeStyles} from '@material-ui/core/styles';

import {ReactComponent as SendIcon} from 'assets/images/icons/send-square.svg';
import Skeleton from '@material-ui/lab/Skeleton';
import { truncateAddress } from 'utils/text';

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

function SimpleCardGameSkeleton(): JSX.Element {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Grid container style={{color: '#7a8398'}}>
        <Typography variant='h6'>Game Time:</Typography>
        <Typography variant='h6' style={{fontWeight: 600}}>
          <Skeleton>&nbsp;{Math.floor(1 / 3600)}Hrs</Skeleton>
        </Typography>
      </Grid>
      <Typography variant='h4'>
        ID #<Skeleton>{truncateAddress('0x0000000000000000000000')}</Skeleton>
      </Typography>
      <Grid container className={classes.innerContent}>
        <Grid item>
          <Typography variant='h6' style={{color: '#fcc591', fontWeight: 600}}>
            <SendIcon />
            <Skeleton>
              &nbsp;{1} {'MATIC'}
            </Skeleton>
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}

export default SimpleCardGameSkeleton;
