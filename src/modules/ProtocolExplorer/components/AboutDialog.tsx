import React, {useCallback} from 'react';

import {useIntl} from 'react-intl';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import {DialogProps} from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import CloseIcon from '@material-ui/icons/Close';
import IntlMessages from '@crema/utility/IntlMessages';
import Info from '@material-ui/icons/Info';

interface Props extends DialogProps {
  textInfo: string;
}

export const AbountDialog = (props: Props) => {
  const {open, onClose, textInfo} = props;
  const {messages} = useIntl();

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  }, [onClose]);

  return (
    <Dialog open={open}>
      <DialogTitle>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Box display='flex' alignItems='center' alignContent='center'>
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'
              alignContent='center'
              mr={2}>
              <Info />
            </Box>
            <Typography variant='body1'>
              <IntlMessages id='Receive' />
            </Typography>
          </Box>
          <Box>
            <IconButton size='small' onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant='body1'>{textInfo}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} startIcon={<CloseIcon />}>
          <IntlMessages id='app.protocolExplorer.close' />
        </Button>
      </DialogActions>
    </Dialog>
  );
};
