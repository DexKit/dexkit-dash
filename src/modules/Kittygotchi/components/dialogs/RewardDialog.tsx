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
import CustomDialogTitle from 'shared/components/CustomDialogTitle';
import {useIntl} from 'react-intl';

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
  const {messages} = useIntl();
  return (
    <Dialog {...dialogProps}>
      <CustomDialogTitle
        title={messages['app.kittygotchi.collectReward']}
        icon={<GiftIcon className={classes.icon} />}
        onClose={handleClose}
      />

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
                <IntlMessages id='app.kittygotchi.youWon' />
              </Typography>
              <Typography align='center' variant='body1'>
                <IntlMessages id='app.kittygotchi.reviewThisText' />
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default RewardDialog;
