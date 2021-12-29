import React from 'react';

import {
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogProps,
  Button,
  useTheme,
  DialogContent,
  Box,
} from '@material-ui/core';

import InfoIcon from '@material-ui/icons/Info';
import IntlMessages from '@crema/utility/IntlMessages';

export interface ConfirmDialogProps extends DialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default (props: ConfirmDialogProps) => {
  const {onConfirm, onCancel} = props;

  const theme = useTheme();

  return (
    <Dialog {...props}>
      <DialogTitle>
        <Typography variant='body1'>
          <IntlMessages id='app.wizard.creatingCollection' />
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={4}>
          <Grid xs={12} item>
            <Box display='flex' justifyContent='center'>
              <InfoIcon style={{fontSize: theme.spacing(16)}} />
            </Box>
          </Grid>
          <Grid xs={12} item>
            <Typography variant='h5' align='center'>
              <IntlMessages id='app.wizard.creatingCollection' />
            </Typography>
            <Typography color='textSecondary' variant='body1' align='center'>
              <IntlMessages id='app.wizard.reallyWantToCreateCollection' />
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant='contained' color='primary' onClick={onConfirm}>
          <IntlMessages id='app.wizard.confirm' />
        </Button>
        <Button variant='contained' onClick={onCancel}>
          <IntlMessages id='app.wizard.cancel' />
        </Button>
      </DialogActions>
    </Dialog>
  );
};
