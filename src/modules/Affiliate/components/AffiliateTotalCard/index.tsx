import React from 'react';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import MoneyIcon from '@material-ui/icons/MonetizationOnTwoTone';

import {makeStyles} from '@material-ui/core/styles';
import {toCurrency} from '../../../../utils/currency';

const useStyles = makeStyles((theme) => ({
  container: {
    color: '#fff',
    borderRadius: 6,
    background: '#2e3243',
  },
  innerContent: {
    color: '#7A8398',
    fontSize: '1rem',
  },
}));

interface Props {
  total: number;
}

function AffiliateTotalCard(props: Props): JSX.Element {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Grid
        container
        className={classes.innerContent}
        spacing={2}
        alignItems='flex-end'>
        <Grid item xs={2}>
          <Box bgcolor='#7A8398' textAlign='center' style={{borderRadius: 50}}>
            <MoneyIcon color='primary' style={{fontSize: 35}} />
          </Box>
        </Grid>
        <Grid item xs={10}>
          <Typography variant='subtitle2'>Total</Typography>
          <Typography variant='h5' style={{color: '#fff'}}>
            {toCurrency(value)}
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}

export default AffiliateTotalCard;
