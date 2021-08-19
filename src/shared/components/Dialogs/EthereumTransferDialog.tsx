import {
  Dialog,
  DialogContent,
  Grid,
  Button,
  Typography,
} from '@material-ui/core';
import React from 'react';

interface EtherTransferDialogProps {
  open: boolean;
  fromAddress: string;
  fromAddressLabel: string;
  toAddress: string;
  toAddressLabel: string;
  gasPrice: string;
  gasLimit: string;
}

export const EtherTransferDialog = (props: EtherTransferDialogProps) => {
  const {
    open,
    fromAddress,
    fromAddressLabel,
    toAddress,
    toAddressLabel,
    gasPrice,
    gasLimit,
  } = props;

  return (
    <Dialog open={open}>
      <DialogContent>
        <Grid container>
          <Grid item xs={12}>
            <Grid container spacing={2} direction='column'>
              <Grid item>
                <Typography>
                  {fromAddress == fromAddressLabel
                    ? fromAddress
                    : fromAddressLabel}
                </Typography>
              </Grid>
              <Grid item></Grid>
              <Grid item></Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={6}>
                <Button color='primary' variant='contained'>
                  Confirm
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button>Cancel</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
