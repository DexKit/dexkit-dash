import React, {useCallback} from 'react';
import {
  DialogProps,
  Dialog,
  DialogContent,
  Box,
  Grid,
  Typography,
  DialogTitle,
  makeStyles,
  Divider,
  IconButton,
} from '@material-ui/core';
import {GiftIcon, RewardDialogIcon} from 'shared/components/Icons';

import CloseIcon from '@material-ui/icons/Close';

import IntlMessages from '@crema/utility/IntlMessages';

const useStyles = makeStyles((theme) => ({
  icon: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
}));

interface RewardDialogProps {
  dialogProps: DialogProps;
}

export const RewardDialog = (props: RewardDialogProps) => {
  const {dialogProps} = props;
  const {onClose} = dialogProps;

  const classes = useStyles();

  const handleClose = useCallback(
    (e) => {
      if (onClose) {
        onClose({}, 'backdropClick');
      }
    },
    [onClose],
  );

  return (
    <Dialog {...dialogProps}>
      <DialogTitle>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Box display='flex' alignItems='center' alignContent='center'>
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'
              alignContent='center'
              mr={2}>
              <GiftIcon className={classes.icon} />
            </Box>
            <Typography variant='body1'>Collect reward</Typography>
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
        <Box p={4}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Box
                display='flex'
                alignItems='center'
                alignContent='center'
                justifyContent='center'>
                <RewardDialogIcon />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography align='center' variant='h5'>
                You won 300 KIT
              </Typography>
              <Typography align='center' variant='body1'>
                Review this text
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default RewardDialog;
