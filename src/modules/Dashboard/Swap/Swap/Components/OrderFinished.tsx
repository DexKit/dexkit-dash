import {Grid, Box, Typography, Button} from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import React from 'react';

interface Props {
  onReset: () => void;
}

export const OrderFinished = (props: Props) => {
  const {onReset} = props;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box display='flex' alignItems='center' justifyContent='center'>
          <CheckCircleIcon />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Typography variant='subtitle1'>Transaction finished</Typography>
        <Typography variant='body1'>
          Coins were successfully sent to the recipient address.
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Button onClick={onReset}>Swap again</Button>
      </Grid>
    </Grid>
  );
};

export default OrderFinished;
