import React, {useCallback} from 'react';

import IntlMessages from '@crema/utility/IntlMessages';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import {DialogProps} from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

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
        <Grid item xs={12} />
      </Grid>
    );
  };

  const renderLoading = () => {
    return (
      <Grid container spacing={4}>
        <Grid item xs={12} />
      </Grid>
    );
  };

  const renderDefault = () => {
    return (
      <Grid container spacing={4}>
        <Grid item xs={12} />
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
              mr={2}
            />
            <Typography variant='body1'>
              <IntlMessages key='app.coinLeagues.createChampion' />
            </Typography>
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
              <IntlMessages key='app.coinLeagues.confirm' />
            </Button>
            <Button startIcon={<CloseIcon />} onClick={handleClose}>
              <IntlMessages key='app.coinLeagues.cancel' />{' '}
            </Button>
          </DialogActions>
        </>
      ) : null}
    </Dialog>
  );
};

export default MintChampionDialog;
