import React, {useCallback} from 'react';

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
import {ErrorIcon} from 'shared/components/Icons';

export interface ImportTokenValues {
  name: string;
  address: string;
  symbol: string;
  decimals: string;
}

interface Props {
  dialogProps: DialogProps;
  onSubmit: () => void;
  onChange: (key: string, value: string) => void;
  values: ImportTokenValues;
  loading?: boolean;
  error?: Error;
}

export const ImportTokenDialog: React.FC<Props> = ({
  dialogProps,
  onSubmit,
  onChange,
  values,
  loading,
  error,
}) => {
  const {onClose} = dialogProps;

  const theme = useTheme();

  const handleChange = useCallback(
    (e) => {
      onChange(e.target.name, e.target.value);
    },
    [onChange],
  );

  const handleClickClose = useCallback(() => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  }, [onClose]);

  const {messages} = useIntl();

  const handleSubmit = useCallback(() => {
    onSubmit();
  }, [onSubmit]);

  const renderForm = () => {
    return (
      <Box py={4}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <TextField
              name='name'
              value={values.name}
              onChange={handleChange}
              label={messages['app.settings.name'] as string}
              variant='outlined'
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name='address'
              value={values.address}
              onChange={handleChange}
              label={messages['app.settings.contractAddress'] as string}
              variant='outlined'
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name='symbol'
              value={values.symbol}
              onChange={handleChange}
              label={messages['app.settings.symbol'] as string}
              variant='outlined'
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name='decimals'
              value={values.decimals}
              onChange={handleChange}
              label={messages['app.settings.decimals'] as string}
              variant='outlined'
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={handleSubmit}
              size='large'
              fullWidth
              variant='contained'
              color='primary'>
              <IntlMessages id='app.settings.addCustomToken' />
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderLoading = () => {
    return (
      <Box py={4}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Box
              display='flex'
              alignItems='center'
              alignContent='center'
              justifyContent='center'>
              <CircularProgress color='primary' size={theme.spacing(24)} />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom align='center' variant='h6'></Typography>
            <Typography
              align='center'
              variant='body1'
              color='textSecondary'></Typography>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderError = () => {
    return (
      <Box py={4}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Box
              display='flex'
              alignItems='center'
              alignContent='center'
              justifyContent='center'>
              <ErrorIcon />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom align='center' variant='h6'></Typography>
            <Typography
              align='center'
              variant='body1'
              color='textSecondary'></Typography>
          </Grid>
        </Grid>
      </Box>
    );
  };

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
              <IntlMessages id='app.settings.importToken' />
            </strong>
          </Typography>
          <IconButton onClick={handleClickClose} size='small'>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        {error ? renderError() : loading ? renderLoading() : renderForm()}
      </DialogContent>
    </Dialog>
  );
};

export default ImportTokenDialog;
