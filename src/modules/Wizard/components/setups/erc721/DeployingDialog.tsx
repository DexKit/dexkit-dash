import React, {useCallback, useState} from 'react';
import {
  DialogProps,
  Dialog,
  DialogContent,
  Grid,
  Typography,
  CircularProgress,
  useTheme,
} from '@material-ui/core';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import IntlMessages from '@crema/utility/IntlMessages';

interface DeployingDialogProps extends DialogProps {}

export const DeployingDialog = (props: DeployingDialogProps) => {
  const theme = useTheme();
  const {} = props;

  return (
    <Dialog {...props} disableBackdropClick>
      <DialogContent>
        <Grid
          container
          alignItems='center'
          alignContent='center'
          justify='center'
          direction='column'
          spacing={4}>
          <Grid item>
            <AccountBalanceWalletIcon fontSize='large' />
          </Grid>
          <Grid item>
            <Typography gutterBottom align='center' variant='h5'>
              <IntlMessages id='app.wizard.deployingYourContract' />
            </Typography>
            <Typography align='center' variant='body1'>
              <IntlMessages id='app.wizard.pleaseSignTheTrasaction' />
            </Typography>
          </Grid>
          <Grid item>
            <CircularProgress color='primary' size={theme.spacing(14)} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default DeployingDialog;
