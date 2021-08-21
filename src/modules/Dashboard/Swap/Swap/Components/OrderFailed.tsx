import {Grid, Box, Typography, Button, useTheme} from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';

import React from 'react';
import {getChangellyStatusMessage, STATUS_FAILED} from '../../util';

interface Props {
  onReset: () => void;
}

export const OrderFailed = (props: Props) => {
  const {onReset} = props;
  const theme = useTheme();

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
          In most cases, the amount was less than the minimum. Please contact
          support and provide a transaction id.
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Button variant='outlined' fullWidth onClick={onReset}>
          Swap again
        </Button>
      </Grid>
    </Grid>
  );
};

export default OrderFailed;
