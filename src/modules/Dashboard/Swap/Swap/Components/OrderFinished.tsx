import {Grid, Box, Typography, Button, useTheme} from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import React from 'react';

interface Props {
  onReset: () => void;
}

export const OrderFinished = (props: Props) => {
  const {onReset} = props;
  const theme = useTheme();

  return (
    <Grid container spacing={2}>
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
        <Typography align='center' variant='subtitle1'>
          Transaction finished
        </Typography>
        <Typography align='center' variant='body2' color='textSecondary'>
          Coins were successfully sent to the recipient address.
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

export default OrderFinished;
