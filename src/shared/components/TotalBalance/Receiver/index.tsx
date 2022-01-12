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
  useTheme,
  useMediaQuery,
  Chip,
} from '@material-ui/core';
import {ImportWhiteIcon} from 'shared/components/Icons';

import {useChainInfo} from 'hooks/useChainInfo';

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

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {chainName} = useChainInfo();
  return (
    <Dialog
      fullWidth
      maxWidth='xs'
      open={open}
      onClose={onClose}
      fullScreen={isMobile}>
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
          <Box alignContent='center' alignItems='center' display='flex'>
            <Box
              alignContent='center'
              alignItems='center'
              display='flex'
              mr={2}>
              <Chip size='small' label={chainName} />
            </Box>
            <IconButton size='small' onClick={handleClose}>
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
