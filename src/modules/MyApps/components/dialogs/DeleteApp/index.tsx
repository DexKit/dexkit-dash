import {
  Box,
  Button,
  DialogProps,
  Dialog,
  DialogContent,
  Grid,
  CircularProgress,
  useTheme,
  Typography,
} from '@material-ui/core';
import React, {useCallback} from 'react';
import {ErrorIcon, SuccessIcon} from 'shared/components/Icons';

import IntlMessages from '@crema/utility/IntlMessages';

interface Props {
  loading?: boolean;
  error?: boolean;
  done?: boolean;
  dialogProps: DialogProps;
}

export const DeleteAppDialog = (props: Props) => {
  const {dialogProps, loading, error, done} = props;

  const theme = useTheme();

  const handleClose = useCallback(() => {
    if (dialogProps.onClose) {
      dialogProps.onClose({}, 'backdropClick');
    }
  }, [dialogProps]);

  return (
    <Dialog {...dialogProps} onClose={handleClose} fullWidth maxWidth='xs'>
      <DialogContent>
        <Box py={4}>
          {loading ? (
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Box
                  display='flex'
                  alignItems='center'
                  alignContent='center'
                  justifyContent='center'>
                  <CircularProgress color='primary' size={theme.spacing(24)} />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography align='center' variant='h6'>
                  <IntlMessages
                    id='app.myapps.deleteAPP'
                    defaultMessage={'Deletting your app'}
                  />
                </Typography>
                <Typography
                  align='center'
                  variant='body1'
                  color='textSecondary'>
                  <IntlMessages
                    id='app.myapps.pleaseSign'
                    defaultMessage={
                      'Please sign message with your wallet to delete app'
                    }
                  />
                </Typography>
              </Grid>
            </Grid>
          ) : null}
          {done ? (
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Box
                  display='flex'
                  alignItems='center'
                  alignContent='center'
                  justifyContent='center'>
                  <SuccessIcon />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography gutterBottom align='center' variant='h6'>
                  <IntlMessages
                    id='app.myapps.submitted'
                    defaultMessage={'Your app was deleted '}
                  />
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Button onClick={handleClose} color='primary' fullWidth>
                  <IntlMessages
                    id='app.myapps.close'
                    defaultMessage={'Close'}
                  />
                </Button>
              </Grid>
            </Grid>
          ) : null}
          {error ? (
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Box
                  display='flex'
                  alignItems='center'
                  alignContent='center'
                  justifyContent='center'>
                  <ErrorIcon />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography gutterBottom align='center' variant='h6'>
                  <IntlMessages
                    id='app.myapps.errorDeleteApp'
                    defaultMessage={
                      'Error deleting your app, please contact support'
                    }
                  />
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Button onClick={handleClose} color='primary' fullWidth>
                  <IntlMessages
                    id='app.myapps.close'
                    defaultMessage={'Close'}
                  />
                </Button>
              </Grid>
            </Grid>
          ) : null}
        </Box>
      </DialogContent>
    </Dialog>
  );
};
