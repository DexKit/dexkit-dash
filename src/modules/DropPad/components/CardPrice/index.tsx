import React from 'react';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import {makeStyles} from '@material-ui/core/styles';
import { BigNumber, ethers } from 'ethers';

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
  price: BigNumber;
}

function CardPrice(props: Props): JSX.Element {
  const classes = useStyles();
  const { price } = props;

  const formattedPrice = ethers.utils.formatEther(price);
  /*const value = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(props.prizePool);*/

  return (
    <Container className={classes.container}>
      <Grid container className={classes.innerContent}>
        <Grid item>
          <Typography variant='subtitle2' style={{color: '#7A8398'}}>
            Price
          </Typography>
          <Typography variant='h4' style={{color: '#fff'}}>
            {formattedPrice} MATIC
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CardPrice;
