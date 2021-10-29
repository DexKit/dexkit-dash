import React from 'react';

import {useIntl} from 'react-intl';

import {Box, Button, Grid, Typography, useTheme} from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';

import {getChangellyStatusMessage, STATUS_FAILED} from '../../util';

interface Props {
  onReset: () => void;
}

export const OrderFailed = (props: Props) => {
  const {onReset} = props;
  const theme = useTheme();
  const {messages} = useIntl();

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Box display='flex' alignItems='center' justifyContent='center'>
          <ErrorIcon
            style={{
              fontSize: theme.spacing(16),
              color: theme.palette.error.main,
            }}
          />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Typography align='center' variant='h5'>
          {getChangellyStatusMessage(STATUS_FAILED)}
        </Typography>
        <Typography align='center' variant='body2' color='textSecondary'>
          {messages['dashboard.swap.info']}
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

export default OrderFailed;
