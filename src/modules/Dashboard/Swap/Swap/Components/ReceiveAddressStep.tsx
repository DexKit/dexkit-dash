import {
  Button,
  Grid,
  Typography,
  Checkbox,
  CircularProgress,
  useTheme,
} from '@material-ui/core';
import React, {useCallback} from 'react';
import {ReceiveAddressInput} from './ReceiveAddressInput';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SwapVertIcon from '@material-ui/icons/SwapVert';

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
    onGoBack,
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
      <Grid item xs={12}>
        <Button
          disabled={loading || !acceptAML || addressToSend == ''}
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
      <Grid item xs={12}>
        <Button
          disabled={loading}
          fullWidth
          startIcon={<ArrowBackIcon />}
          onClick={onGoBack}
          variant='outlined'>
          Back
        </Button>
      </Grid>
    </Grid>
  );
};
