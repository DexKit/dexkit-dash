import React, {useCallback} from 'react';
import {
  DialogProps,
  Dialog,
  DialogContent,
  Box,
  Button,
  Grid,
  Typography,
  CircularProgress,
  useTheme,
} from '@material-ui/core';
import {SuccessIcon} from 'shared/components/Icons';

import IntlMessages from '@crema/utility/IntlMessages';

interface Props {
  dialogProps: DialogProps;
  loading: boolean;
  done: boolean;
}

export const UpdateKittygotchiDialog = (props: Props) => {
  const {dialogProps, done} = props;
  const {onClose} = dialogProps;

  const {loading} = props;

  const theme = useTheme();

  const handleClose = useCallback(
    (e) => {
      if (onClose) {
        onClose({}, 'backdropClick');
      }
    },
    [onClose],
  );

  const renderLoading = () => {
    return (
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
          <Typography gutterBottom align='center' variant='h5'>
            <IntlMessages id='app.kittygotchi.updatingYourKittygotchi' />
          </Typography>
          <Typography color='textSecondary' align='center' variant='body1'>
            <IntlMessages id='app.kittygotchi.waitUntilweUpdate' />
          </Typography>
        </Grid>
      </Grid>
    );
  };

  const renderSuccess = () => {
    return (
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
          <Typography gutterBottom align='center' variant='h5'>
            <IntlMessages id='app.kittygotchi.kittygotchiUpdated' />
          </Typography>
          <Typography color='textSecondary' align='center' variant='body1'>
            <IntlMessages id='app.kittygotchi.kittygotchiUpdatedSuccessfully' />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button onClick={handleClose} fullWidth color='primary'>
            <IntlMessages id='app.kittygotchi.dialog.close' />
          </Button>
        </Grid>
      </Grid>
    );
  };

  return (
    <Dialog {...dialogProps} maxWidth='xs' fullWidth>
      <DialogContent>
        <Box py={4}>
          {loading ? renderLoading() : done ? renderSuccess() : null}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateKittygotchiDialog;
