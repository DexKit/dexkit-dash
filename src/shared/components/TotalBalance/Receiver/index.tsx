import React, {useCallback} from 'react';
import ReceiverForm from './ReceiverForm';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  makeStyles,
  IconButton,
} from '@material-ui/core';
import {ImportWhiteIcon} from 'shared/components/Icons';

import CloseIcon from '@material-ui/icons/Close';
import IntlMessages from '@crema/utility/IntlMessages';

const useStyles = makeStyles((theme) => ({
  icon: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
}));

interface Props {
  open: boolean;
  onClose: () => void;
}

const Receiver: React.FC<Props> = (props) => {
  const classes = useStyles();
  const {open, onClose} = props;

  const handleClose = useCallback(
    (e) => {
      if (onClose) {
        onClose();
      }
    },
    [onClose],
  );

  return (
    <Dialog fullWidth maxWidth='xs' open={open} onClose={onClose}>
      <DialogTitle>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Box display='flex' alignItems='center' alignContent='center'>
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'
              alignContent='center'
              mr={2}>
              <ImportWhiteIcon className={classes.icon} />
            </Box>
            <Typography variant='body1'>
              <IntlMessages id='Receive' />
            </Typography>
          </Box>
          <Box>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <ReceiverForm />
      </DialogContent>
    </Dialog>
  );
};

export default Receiver;
