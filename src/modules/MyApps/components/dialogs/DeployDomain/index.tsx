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
  cname?: string;
  dialogProps: DialogProps;
}

export const DeployDomainDialog = (props: Props) => {
  const {dialogProps, loading, error, done, cname} = props;

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
                    id='app.myapps.submittingConfig'
                    defaultMessage={
                      'Deploying your domain, you need after to set your cname in your domain provider'
                    }
                  />
                </Typography>
                <Typography
                  align='center'
                  variant='body1'
                  color='textSecondary'>
                  <IntlMessages
                    id='app.myapps.pleaseSign'
                    defaultMessage={
                      'Please sign message with your wallet to set config'
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
                    defaultMessage={'Your domain is now with pending status '}
                  />
                </Typography>
              </Grid>
              {cname ? (
                <Grid item xs={12}>
                  <Typography align='center' variant='h6'>
                    <IntlMessages
                      id='app.myapps.pointCname'
                      defaultMessage={
                        'Please add this CNAME {cname} record in your hosting provider'
                      }
                      values={{cname}}
                    />
                  </Typography>
                </Grid>
              ) : null}

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
                    id='app.myapps.domainErrorSubmit'
                    defaultMessage={
                      'Error submitting domain, is this domain already in use?'
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
