import React from 'react';

import {useIntl} from 'react-intl';

import {Box, Button, Grid, Typography, useTheme} from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

interface Props {
  onReset: () => void;
}

export const OrderFinished = (props: Props) => {
  const {onReset} = props;
  const theme = useTheme();
  const {messages} = useIntl();

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Box display='flex' alignItems='center' justifyContent='center'>
          <CheckCircleIcon
            style={{
              fontSize: theme.spacing(16),
              color: theme.palette.success.main,
            }}
          />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Typography align='center' variant='h5'>
          {messages['app.transactionFinished']}
        </Typography>
        <Typography align='center' variant='body2' color='textSecondary'>
          {messages['app.coinsSuccessSent']}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Button variant='outlined' fullWidth onClick={onReset}>
          {messages['app.swapAgain']}
        </Button>
      </Grid>
    </Grid>
  );
};

export default OrderFinished;
