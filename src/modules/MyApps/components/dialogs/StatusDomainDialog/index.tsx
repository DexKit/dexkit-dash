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
  error?: Boolean;
  done?: boolean;
  cname?: string;
  dialogProps: DialogProps;
  onValidateDomain?: () => void;
}

export const StatusDomainDialog = (props: Props) => {
  const {dialogProps, loading, error, done, cname, onValidateDomain} = props;

  const theme = useTheme();

  const handleClose = useCallback(() => {
    if (dialogProps.onClose) {
      dialogProps.onClose({}, 'backdropClick');
    }
  }, [dialogProps]);

  return (
    <Dialog {...dialogProps} onClose={handleClose} fullWidth maxWidth='sm'>
      <DialogContent>
        <Box py={4}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography align='center' variant='h6'>
                <IntlMessages
                  id='app.myapps.validateDomain'
                  defaultMessage={
                    'Add Follow CNAME to your domain provider to validate it'
                  }
                />
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography align='center' variant='h6' color='textSecondary'>
                {cname}
              </Typography>
            </Grid>
            {loading && (
              <Grid item xs={12}>
                <Box
                  display='flex'
                  alignItems='center'
                  alignContent='center'
                  justifyContent='center'>
                  <CircularProgress color='primary' size={theme.spacing(24)} />
                </Box>
              </Grid>
            )}
            <Grid item xs={12}>
              <Button
                variant='contained'
                onClick={onValidateDomain}
                color='primary'
                fullWidth>
                <IntlMessages
                  id='app.myapps.validateDomain'
                  defaultMessage={'Validate Domain'}
                />
              </Button>
            </Grid>
            {(!done || !error) && (
              <Grid item xs={12}>
                <Button onClick={handleClose} color='primary' fullWidth>
                  <IntlMessages
                    id='app.myapps.close'
                    defaultMessage={'Close'}
                  />
                </Button>
              </Grid>
            )}
          </Grid>

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
                    defaultMessage={
                      'Your domain is now validated and ready for use '
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
                <Typography
                  align='center'
                  variant='body1'
                  color='textSecondary'>
                  <IntlMessages
                    id='app.myapps.pleaseTry'
                    defaultMessage={'Please try again'}
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
