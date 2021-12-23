import React, {useCallback} from 'react';

import Close from '@material-ui/icons/Close';

import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogProps,
  Divider,
  DialogTitle,
  Grid,
  Button,
  Typography,
  Box,
  IconButton,
} from '@material-ui/core';
import IntlMessages from '@crema/utility/IntlMessages';

import * as types from '../types';

import DoneIcon from '@material-ui/icons/Done';

interface Props {
  dialogProps: DialogProps;
  network?: types.Network;
  onConfirm: () => void;
}

export const ConfirmRemoveNetworkDialog: React.FC<Props> = ({
  dialogProps,
  network,
  onConfirm,
}) => {
  const {onClose} = dialogProps;

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  }, [onClose]);

  const renderDetails = () => {
    return (
      <Grid direction='column' container spacing={4}>
        <Grid item>
          <Typography variant='body1'>
            <IntlMessages id='app.wallet.areYouSureNetworkWillBeRemoved' />
          </Typography>
        </Grid>
      </Grid>
    );
  };

  return (
    <Dialog {...dialogProps}>
      <DialogTitle>
        <Box
          display='flex'
          alignItems='center'
          alignContent='center'
          justifyContent='space-between'>
          <Box>
            <Typography variant='body1'>
              <IntlMessages id='app.wallet.confirmRemove' />
            </Typography>
          </Box>
          <IconButton size='small' onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box py={4}>{renderDetails()}</Box>
      </DialogContent>
      <DialogActions>
        <Button
          startIcon={<DoneIcon />}
          onClick={onConfirm}
          variant='contained'
          color='primary'>
          <IntlMessages id='app.wallet.confirm' />
        </Button>
        <Button startIcon={<Close />} onClick={handleClose}>
          <IntlMessages id='app.wallet.cancel' />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmRemoveNetworkDialog;
