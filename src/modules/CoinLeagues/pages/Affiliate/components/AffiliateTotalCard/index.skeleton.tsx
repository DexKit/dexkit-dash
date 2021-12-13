import React from 'react';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import MoneyIcon from '@material-ui/icons/MonetizationOnTwoTone';

import {makeStyles} from '@material-ui/core/styles';
import {ReactComponent as WalletIcon} from 'assets/images/icons/wallet-white.svg';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles((theme) => ({
  container: {
    color: '#fff',
    height: theme.spacing(20),
    borderRadius: 6,
    background: '#2e3243',
  },
  innerContent: {
    color: '#7A8398',
    fontSize: '1rem',
  },
}));



function AffiliateTotalCardSkeleton(): JSX.Element {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Grid
        container
        className={classes.innerContent}
        spacing={4}
        alignItems='center'>
        <Grid item xs={2} style={{textAlign: 'center', padding: 0}}>
          <MoneyIcon color='primary' style={{fontSize: 50}} />
        </Grid>
        <Grid item xs={8}>
          <Typography variant='subtitle2'>Estimated Earnings</Typography>
          <Typography variant='h5' style={{color: '#fff'}}>
            <Skeleton> - MATIC </Skeleton>
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <WalletIcon height={35} width={35} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default AffiliateTotalCardSkeleton;
