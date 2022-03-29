import React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import MoneyIcon from '@material-ui/icons/MonetizationOn';

import {useUSDFormatter} from '../../../../hooks/utils/useUSDFormatter';
import IntlMessages from '../../../../@crema/utility/IntlMessages';

interface Props {
  total: number;
}

function AffiliateTotalCard(props: Props) {
  const {usdFormatter} = useUSDFormatter();

  return (
    <Box p={2} component={Paper}>
      <Grid container spacing={4} alignItems='center'>
        <Grid item>
          <MoneyIcon style={{fontSize: 50}} />
        </Grid>
        <Grid item xs>
          <Typography gutterBottom variant='caption' color='textSecondary'>
            <IntlMessages id='app.affiliate.total' />
          </Typography>
          <Typography variant='h5'>
            {usdFormatter.format(props.total)}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AffiliateTotalCard;
