import React, {useCallback} from 'react';
import {
  DialogProps,
  Dialog,
  DialogContent,
  Box,
  Button,
  Grid,
  Typography,
  DialogTitle,
  makeStyles,
  Divider,
  IconButton,
} from '@material-ui/core';
import {GiftIcon, SuccessIcon} from 'shared/components/Icons';

import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';

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

export const MintKittygotchiSuccessDialog = (props: RewardDialogProps) => {
  const {dialogProps} = props;
  const {onClose} = dialogProps;

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
      <DialogContent>
        <Box py={4}>
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
              <Typography align='center' variant='h5'>
                Kittygotchi  <IntlMessages id='app.kittygotchi.created' />
              </Typography>
              <Typography color='textSecondary' align='center' variant='body1'>
                Kittygotchi <IntlMessages id='app.kittygotchi.createdSuccessfully' />
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button onClick={handleClose} fullWidth color='primary'>
              <IntlMessages id='app.kittygotchi.close' />
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default MintKittygotchiSuccessDialog;
