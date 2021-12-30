import React, {useCallback} from 'react';

import {
  DialogProps,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  DialogActions,
  IconButton,
  Button,
} from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';
import IntlMessages from '@crema/utility/IntlMessages';
import Info from '@material-ui/icons/Info';
import CustomDialogTitle from 'shared/components/CustomDialogTitle';
import { useIntl } from 'react-intl';

interface Props extends DialogProps {
  textInfo: string;
}

export const AbountDialog = (props: Props) => {
  const {open, onClose, textInfo} = props;

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  }, [onClose]);

  const { messages } = useIntl();

  return (
    <Dialog open={open}>
      <CustomDialogTitle title={messages['Receive']} icon={<Info/>} onClose={handleClose}/>
      {/* <DialogTitle>
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
      </DialogTitle> */}
      <DialogContent>
        <Typography variant='body1'>{textInfo}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} startIcon={<CloseIcon />}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
