import React, {useCallback, useState} from 'react';
import {
  DialogProps,
  Dialog,
  DialogContent,
  Grid,
  Typography,
  CircularProgress,
  useTheme,
  Button,
} from '@material-ui/core';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

interface DeployErrorDialogProps extends DialogProps {
  error: string;
  onTryAgain: () => void;
  onCancel: () => void;
}

export const DeployErrorDialog = (props: DeployErrorDialogProps) => {
  const theme = useTheme();
  const {error, onTryAgain, onCancel} = props;

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
            <ErrorOutlineIcon
              style={{
                color: theme.palette.error.main,
                fontSize: theme.spacing(16),
              }}
            />
          </Grid>
          <Grid item>
            <Typography gutterBottom align='center' variant='h5'>
              Smart contract deploy failed
            </Typography>
            <Typography
              style={{color: theme.palette.error.main}}
              align='center'
              variant='body1'>
              {error}
            </Typography>
          </Grid>
          <Grid item>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button
                  onClick={onTryAgain}
                  color='primary'
                  variant='contained'>
                  Try again
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button onClick={onCancel}>Close</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default DeployErrorDialog;
