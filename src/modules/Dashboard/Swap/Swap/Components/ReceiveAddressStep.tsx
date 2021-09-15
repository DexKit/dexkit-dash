import {
  Button,
  Grid,
  Typography,
  Checkbox,
  CircularProgress,
  useTheme,
} from '@material-ui/core';
import React from 'react';
import {ReceiveAddressInput} from './ReceiveAddressInput';

import SwapVertIcon from '@material-ui/icons/SwapVert';
import {Alert} from '@material-ui/lab';

interface Props {
  toCoin: any;
  addressToSend: string;
  onChange: (value: string) => void;
  onPaste: (value: string) => void;
  acceptAML: boolean;
  onAcceptChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSwap: () => void;
  loading: boolean;
  onGoBack: () => void;
  transactionError?: string;
}

export const ReceiveAddressStep = (props: Props) => {
  const {
    toCoin,
    addressToSend,
    onChange,
    onPaste,
    onAcceptChange,
    acceptAML,
    onSwap,
    loading,
    transactionError,
  } = props;
  const theme = useTheme();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant='body1'>Receive Address</Typography>
      </Grid>
      <Grid item xs={12}>
        <ReceiveAddressInput
          coin={toCoin}
          address={addressToSend}
          onChange={onChange}
          onPaste={onPaste}
        />
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item>
            <Checkbox
              checked={acceptAML}
              onChange={onAcceptChange}
              inputProps={{'aria-label': 'servicesCheckbox'}}
            />
          </Grid>
          <Grid item xs>
            <Typography color='textSecondary' variant='body2'>
              “Exchange services provided by Changelly. By clicking “Accept”, I
              acknowledge and understand that my transaction may trigger AML/KYC
              verification according to Changelly AML/KYC”
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      {transactionError ? (
        <Grid item xs={12}>
          <Alert severity='error'>{transactionError}</Alert>
        </Grid>
      ) : null}
      <Grid item xs={12}>
        <Button
          disabled={loading || !acceptAML || addressToSend === ''}
          onClick={onSwap}
          fullWidth
          size='large'
          variant='contained'
          color='primary'
          startIcon={loading ? null : <SwapVertIcon />}>
          {loading ? (
            <CircularProgress size={theme.spacing(6)} color='inherit' />
          ) : (
            'Swap'
          )}
        </Button>
      </Grid>
    </Grid>
  );
};
