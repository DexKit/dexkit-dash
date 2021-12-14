import React from 'react';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import {makeStyles} from '@material-ui/core/styles';
import { GET_CHAIN_NATIVE_COIN } from 'shared/constants/Blockchain';
import { GET_LEAGUES_CHAIN_ID } from 'modules/CoinLeagues/utils/constants';
import { useWeb3 } from 'hooks/useWeb3';

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

interface Props {
  prizePool?: number;
}

function CardPrize(props: Props): JSX.Element {
  const classes = useStyles();
  const {chainId} = useWeb3();
  const {prizePool} = props;
  /*const value = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(props.prizePool);*/

  return (
    <Container className={classes.container}>
      <Grid container className={classes.innerContent}>
        <Grid item>
          <Typography variant='subtitle2' style={{color: '#7A8398'}}>
           Max Prize Pool
          </Typography>
          <Typography variant='h4' style={{color: '#fff'}}>
            {prizePool || '-'} {GET_CHAIN_NATIVE_COIN(GET_LEAGUES_CHAIN_ID(chainId))}
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CardPrize;
