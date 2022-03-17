import {
  Box,
  DialogProps,
  Dialog,
  DialogContent,
  Grid,
  Typography,
} from '@material-ui/core';
import React, {useCallback} from 'react';

import IntlMessages from '@crema/utility/IntlMessages';

interface Props {
  cname: string;
  dialogProps: DialogProps;
}

export const SucceededDialog = (props: Props) => {
  const {dialogProps, cname} = props;

  const handleClose = useCallback(() => {
    if (dialogProps.onClose) {
      dialogProps.onClose({}, 'backdropClick');
    }
  }, [dialogProps]);

  return (
    <Dialog {...dialogProps} onClose={handleClose} fullWidth maxWidth='sm'>
      <DialogContent>
        <Box py={4}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography align='center' variant='h6'>
                <IntlMessages
                  id='myapps.infosucceded'
                  defaultMessage={
                    'Your app was added to our system, if your app is not being served on your domain, make sure you setup correctly your CNAME, contact support if error persists'
                  }
                />
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography align='center' variant='h6' color='textSecondary'>
                {cname}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                align='center'
                variant='subtitle1'
                color={'textPrimary'}>
                <IntlMessages
                  id='myapps.holdKit'
                  defaultMessage={
                    'Hold 100 KIT in your fee recipient address to keep domain active. Hold 500 KIT to get swap fees routed to your fee recipient address on the respective network'
                  }
                />
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
