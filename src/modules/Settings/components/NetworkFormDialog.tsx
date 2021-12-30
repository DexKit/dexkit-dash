import React, {useCallback, useMemo} from 'react';

import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogProps,
  Typography,
  IconButton,
  Button,
  Grid,
  Divider,
  TextField,
} from '@material-ui/core';

import IntlMessages from '@crema/utility/IntlMessages';
import {useIntl} from 'react-intl';

import Close from '@material-ui/icons/Close';
import {isValidURL} from 'utils/browser';

export interface NetworkFormState {
  name: string;
  rpcUrl: string;
  chainId: string;
  nativeTokenSymbol: string;
  explorerUrl: string;
}

interface Props {
  dialogProps: DialogProps;
  values: NetworkFormState;
  onChange: (key: string, value: string) => void;
  onSubmit: () => void;
}

export const NetworkFormDialog: React.FC<Props> = ({
  dialogProps,
  values,
  onChange,
  onSubmit,
}) => {
  const {onClose} = dialogProps;

  const {messages} = useIntl();

  const handleClickClose = useCallback(() => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  }, [onClose]);

  const handleChange = useCallback(
    (e) => {
      onChange(e.target.name, e.target.value);
    },
    [onChange],
  );

  const handleSubmit = useCallback(() => {
    onSubmit();
  }, [onSubmit]);

  const isFormValid = useMemo(() => {
    if (
      values.name === '' ||
      values.rpcUrl === '' ||
      values.chainId === '0' ||
      values.chainId === ''
    ) {
      return false;
    }

    if (values.rpcUrl !== '' && !isValidURL(values.rpcUrl)) {
      return false;
    }

    if (values.explorerUrl !== '' && !isValidURL(values.explorerUrl)) {
      return false;
    }

    if (!/^[A-Z]+$/.test(values.nativeTokenSymbol.toUpperCase())) {
      return false;
    }

    if (!/^[0-9]+$/.test(values.chainId)) {
      return false;
    }

    return true;
  }, [values]);

  const renderForm = () => {
    return (
      <Box py={4}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <TextField
              name='name'
              value={values.name}
              onChange={handleChange}
              label={messages['app.settings.networkName'] as string}
              variant='outlined'
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              name='rpcUrl'
              value={values.rpcUrl}
              onChange={handleChange}
              label={messages['app.settings.rpcUrl'] as string}
              variant='outlined'
              error={!isValidURL(values.rpcUrl) && values.rpcUrl !== ''}
              helperText={
                !isValidURL(values.rpcUrl) && values.rpcUrl !== ''
                  ? (messages['app.settings.invalidUrl'] as string)
                  : undefined
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              name='chainId'
              value={values.chainId}
              onChange={handleChange}
              label={messages['app.settings.chainId'] as string}
              variant='outlined'
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              name='nativeTokenSymbol'
              value={values.nativeTokenSymbol}
              onChange={handleChange}
              label={messages['app.settings.networkTokenSymbol'] as string}
              variant='outlined'
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name='explorerUrl'
              value={values.explorerUrl}
              onChange={handleChange}
              label={messages['app.settings.explorerUrl'] as string}
              variant='outlined'
              error={
                !isValidURL(values.explorerUrl || '') &&
                values.explorerUrl !== ''
              }
              helperText={
                !isValidURL(values.explorerUrl || '') &&
                values.explorerUrl !== ''
                  ? (messages['app.settings.invalidUrl'] as string)
                  : undefined
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              disabled={!isFormValid}
              onClick={handleSubmit}
              size='large'
              fullWidth
              variant='contained'
              color='primary'>
              <IntlMessages id='app.settings.saveNetwork' />
            </Button>
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
              <IntlMessages id='app.settings.addANetwork' />
            </strong>
          </Typography>
          <IconButton onClick={handleClickClose} size='small'>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>{renderForm()}</DialogContent>
    </Dialog>
  );
};

export default NetworkFormDialog;
