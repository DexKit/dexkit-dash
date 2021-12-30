import React, {useCallback, useState} from 'react';

import {
  Dialog,
  DialogProps,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Grid,
  Divider,
  CircularProgress,
  useTheme,
} from '@material-ui/core';
import Close from '@material-ui/icons/Close';
import IntlMessages from '@crema/utility/IntlMessages';
import {useIntl} from 'react-intl';
import {TokenParams} from 'redux/_settingsv2/actions';

interface Props {
  dialogProps: DialogProps;
  onSubmit: () => void;
  values: TokenParams;
}

export const ImportTokenDialog: React.FC<Props> = ({
  dialogProps,
  onSubmit,
  values,
}) => {
  const {onClose} = dialogProps;

  const theme = useTheme();

  const handleClickClose = useCallback(() => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  }, [onClose]);

  const {messages} = useIntl();

  const handleSubmit = useCallback(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <Dialog {...dialogProps}>
      <DialogTitle>
        <Box
          display='flex'
          alignItems='center'
          alignContent='center'
          justifyContent='space-between'>
          <Typography variant='body1'>
            <strong>
              <IntlMessages id='app.settings.token' />
            </strong>
          </Typography>
          <IconButton onClick={handleClickClose} size='small'>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Box py={4}></Box>
          </Grid>
          <Grid item>
            <Typography color='textSecondary' variant='overline'>
              <IntlMessages id='app.settings.contractAddress' />
            </Typography>
            <Typography variant='body1'>{values.address}</Typography>
          </Grid>
          <Grid item>
            <Typography color='textSecondary' variant='overline'>
              <IntlMessages id='app.settings.symbol' />
            </Typography>
            <Typography variant='body1'>{values.symbol}</Typography>
          </Grid>
          <Grid item>
            <Typography color='textSecondary' variant='overline'>
              <IntlMessages id='app.settings.decimals' />
            </Typography>
            <Typography variant='body1'>{values.decimals}</Typography>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ImportTokenDialog;
