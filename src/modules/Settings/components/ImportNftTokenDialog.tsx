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
  Chip,
} from '@material-ui/core';
import Close from '@material-ui/icons/Close';
import IntlMessages from '@crema/utility/IntlMessages';
import {useIntl} from 'react-intl';
import {ErrorIcon} from 'shared/components/Icons';
import {Web3Wrapper} from '@0x/web3-wrapper';
import {useChainInfo} from 'hooks/useChainInfo';

export interface ImportNftTokenValues {
  address: string;
  tokenId: string;
}

interface Props {
  dialogProps: DialogProps;
  values: ImportNftTokenValues;
  onChange: (key: string, value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  error?: Error;
}

export const ImportNftTokenDialog: React.FC<Props> = ({
  dialogProps,
  onSubmit,
  onChange,
  values,
  loading,
  error,
}) => {
  const {onClose} = dialogProps;

  const {chainName} = useChainInfo();
  const theme = useTheme();
  const {messages} = useIntl();

  const isAddressValid = useCallback((address: string) => {
    return Web3Wrapper.isAddress(address);
  }, []);

  const handleChange = useCallback(
    (e) => {
      onChange(e.target.name, e.target.value.trim());
    },
    [onChange],
  );

  const handleClickClose = useCallback(() => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  }, [onClose]);

  const handleSubmit = useCallback(() => {
    onSubmit();
  }, [onSubmit]);

  const canSubmit = useCallback(() => {
    if (!isAddressValid(values.address)) {
      return false;
    }

    if (values.tokenId === '') {
      return false;
    }

    return true;
  }, [isAddressValid, values]);

  const renderForm = () => {
    return (
      <Box py={4}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <TextField
              name='address'
              value={values.address}
              onChange={handleChange}
              label={messages['app.settings.contractAddress'] as string}
              variant='outlined'
              error={values.address !== '' && !isAddressValid(values.address)}
              helperText={
                values.address !== '' && !isAddressValid(values.address)
                  ? messages['app.wallet.invalidAddress']
                  : null
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name='tokenId'
              value={values.tokenId}
              onChange={handleChange}
              label={messages['app.settings.tokenId'] as string}
              variant='outlined'
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              disabled={!canSubmit()}
              onClick={handleSubmit}
              size='large'
              fullWidth
              variant='contained'
              color='primary'>
              <IntlMessages id='app.settings.addNftToken' />
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
              <IntlMessages id='app.settings.importNft' />
            </strong>
          </Typography>

          <Box display='flex' alignItems='center' alignContent='center'>
            <Box mr={2}>
              <Chip label={chainName} />
            </Box>
            <IconButton onClick={handleClickClose} size='small'>
              <Close />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        {error ? renderError() : loading ? renderLoading() : renderForm()}
      </DialogContent>
    </Dialog>
  );
};

export default ImportNftTokenDialog;
