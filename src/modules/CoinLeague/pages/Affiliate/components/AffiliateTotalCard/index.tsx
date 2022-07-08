import React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import MoneyIcon from '@material-ui/icons/MonetizationOn';

import {Paper} from '@material-ui/core';
import IntlMessages from '@crema/utility/IntlMessages';
import {Skeleton} from '@material-ui/lab';

interface Props {
  total: string;
  coinSymbol: string;
  loading?: boolean;
}

function AffiliateTotalCard({loading, total, coinSymbol}: Props): JSX.Element {
  return (
    <Box p={4} component={Paper}>
      <Grid container spacing={2} alignItems='center' alignContent='center'>
        <Grid item>
          <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
            alignContent='center'>
            <MoneyIcon style={{fontSize: 50}} />
          </Box>
        </Grid>
        <Grid item xs>
          <Typography variant='caption' color='textSecondary'>
            <IntlMessages
              id='coinLeague.estimatedEarnings'
              defaultMessage='Estimated Earnings'
            />
          </Typography>
          <Typography variant='h5'>
            {loading ? (
              <Skeleton />
            ) : (
              <>
                {parseFloat(total).toFixed(4)} {coinSymbol}
              </>
            )}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AffiliateTotalCard;
