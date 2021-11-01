import React, {useCallback} from 'react';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Button,
  Divider,
  Box,
  Grid,
  IconButton,
  Typography,
} from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';

interface MintChampionDialogProps {
  dialogProps: DialogProps;
  error?: any;
  loading?: boolean;
  onConfirm?: () => void;
}

export const MintChampionDialog = (props: MintChampionDialogProps) => {
  const {dialogProps, error, loading, onConfirm} = props;

  const handleClose = useCallback(() => {
    if (dialogProps.onClose) {
      dialogProps.onClose({}, 'backdropClick');
    }
  }, [dialogProps.onClose]);

  const renderError = () => {
    return (
      <Grid container spacing={4}>
        <Grid item xs={12}></Grid>
      </Grid>
    );
  };

  const renderLoading = () => {
    return (
      <Grid container spacing={4}>
        <Grid item xs={12}></Grid>
      </Grid>
    );
  };

  const renderDefault = () => {
    return (
      <Grid container spacing={4}>
        <Grid item xs={12}></Grid>
      </Grid>
    );
  };

  return (
    <Dialog {...dialogProps} onClose={handleClose} maxWidth='xs' fullWidth>
      <DialogTitle>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Box display='flex' alignItems='center' alignContent='center'>
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'
              alignContent='center'
              mr={2}></Box>
            <Typography variant='body1'>Creating Champion</Typography>
          </Box>
          <Box>
            <IconButton size='small' onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        {error ? renderError() : loading ? renderLoading() : renderDefault()}
      </DialogContent>
      {!error && !loading ? (
        <>
          <Divider />
          <DialogActions>
            <Button
              startIcon={<CheckIcon />}
              onClick={onConfirm}
              variant='contained'
              color='primary'>
              Confirm
            </Button>
            <Button startIcon={<CloseIcon />} onClick={handleClose}>
              Cancel
            </Button>
          </DialogActions>
        </>
      ) : null}
    </Dialog>
  );
};

export default MintChampionDialog;
